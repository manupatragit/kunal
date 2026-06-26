/**Remove main notice id frm  session storage */
function fnremovesession() {
    sessionStorage.removeItem("mainnoticeid");
}
var txtmaatterlink = "";
$(function () {
    $("#sideCasename").keypress(function () {
        txtmaatterlink = $("#sideCasename").val();
        $('input[name=grdtot]').val(txtmaatterlink);
    });
});
var fcode = localStorage.getItem("FirmCode");
/*Text search party*/
$(document).on('click', '#txtsearchparty', function () {
    $("#Isquicktab").val("1");
    var vall = $("#txtsearchparty option:selected").text();
    openload();
    var url = "/" + fcode + "/CW/AddLiveUpdateManuallyCase";
    $('.LiveUpdateManuallybody').load(url, function (result) {
        closeload();
        $("#myModalLiveUpdateManually").modal({ show: true });
    });
});



let selectedFilesComm = [];
let selectedFiles = [];

let selectedLocalFiles = [];        
let selectedServerFiles = []; 


let selectedLocalFilesComm = [];
let selectedServerFilesComm = []; 
//$(document).on('change', '#trackcasetype', function () {
//    var fcode1 = localStorage.getItem("FirmCode");
//    var selectedvalue = $(this).val();
//    if (selectedvalue == "1") {
//        //Add by Search by Part Name
//        var urls = "/" + fcode1 + "/CW/SearchByPartyName";
//        location.href = urls;
//    }
//    else if (selectedvalue == "2")
//    {
//         //Add by CNR NO
//        var CaseName = $("#sideCasename").val();
//        var teammember = $("#addtaskmember3").val();

//        //var urls = "/" + fcode1 + "/CW/LitigationAddLiveUpdate?type=1";
//        //location.href = urls;

//        var urls = "/" + fcode + "/CW/LitigationAddLiveUpdate?type=1";
//        url_redirect({
//            url: urls,
//            method: "post",
//            data: { MatterName: CaseName, TeamMember: teammember}
//        });

//    }
//    else if (selectedvalue == "3")
//    {
//        //Add by Case details
//        var CaseName = $("#sideCasename").val();
//        var teammember = $("#addtaskmember3").val();
//        //var urls = "/" + fcode1 + "/CW/LitigationAddLiveUpdate?type=0";
//        //location.href = urls;
//        var urls = "/" + fcode + "/CW/LitigationAddLiveUpdate?type=0";
//        url_redirect({
//            url: urls,
//            method: "post",
//            data: { MatterName: CaseName, TeamMember: teammember }
//        });
//    }
//    else {
//        alert("Please select one option");
//    }


//});
var morepageno = 1;
var morepageno1 = 1;
var morepageno2 = 1;
$(document).ready(function () {
    GetAIToolsQuota();
    var today = new Date().toISOString().split('T')[0];
    $("#codate").val(today);
    //if (ChkControllers.toLowerCase() == "standardcontactslist" || ChkControllers.toLowerCase() == "contactslist" || ChkControllers.toLowerCase() == "createcontacts") {
    //    loadContacttype();

    //}
    if (ChkControllers.toLowerCase() == "standardcaselist" || ChkControllers.toLowerCase() == "caselist" || ChkControllers.toLowerCase() == "expensereport") {
        //loadallclient();
        // loadcontact1()
        var chkNexthearingary = localStorage.getItem("Nexthearingary");
        var chkNexthearingaryRevenue = localStorage.getItem("NexthearingaryRevenue");
        if (chkNexthearingary == null) {

            //NextHearingIfidByUserId();
        }
        //setInterval(function () { NextHearingIfidByUserId() }, 3600000);
    }
    // Load dropdowns after a short delay — don't block dashboard render
    var _dropdownsLoaded = false;
    function loadAllDropdowns() {
        if (_dropdownsLoaded) return;
        _dropdownsLoaded = true;
        bindTask();
        loadmatter_defalut(morepageno);
        addtaskmember();
        bindTaskType();
        loadCompany();
        loadContacttype();
        bindCommonDropdown("Timeentrytype", "TimeEntry_Type", 'Select');
    }
    setTimeout(loadAllDropdowns, 1000);

    if (ChkControllers.toLowerCase() == "personaldashboard") {
        // All dropdowns now lazy-load on first click — removed from page load
    } else {
        Reportmanager();
        setTimeout(() => {
            loadUser();
            loadteamleader();
            loadcontact1();
        }, "5000")
    }
    if (ChkControllers.toLowerCase() == "newcasedashboard") {
        loadmatter_defalut(morepageno);
    }
    if (ChkControllers.toLowerCase() == "standardcontactslist" || ChkControllers.toLowerCase() == "contactslist" || ChkControllers.toLowerCase() == "createcontacts" || ChkControllers.toLowerCase() == "EditClient") {
        setTimeout(() => {
            //loadUser();
            loadCompany();
            //bindTaskType();
            //bindTask();
            //ShowChatReminderDiv();
            // loadallclient();
            loadcontact1()
        }, "5000")
    }
    else {

    }

    /*Get next hearing by user id*/
    function NextHearingIfidByUserId() {
        var formData = new FormData();
        $.ajax({
            timeout: 20000,
            async: true,
            type: "POST",
            url: "/api/MatterApi/NextHearingIfidByUserId",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = JSON.parse(response.Data.data);
                localStorage.setItem("Nexthearingary", JSON.stringify(data));
                var dataRevenue = JSON.parse(response.Data.dataRevenue);
                localStorage.setItem("NexthearingaryRevenue", JSON.stringify(dataRevenue));
            }, //End of AJAX Success function
            failure: function (response) {
                closeload();
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                closeload();
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    filesize = 20480;
    var fcode = localStorage.getItem("FirmCode");
    $("#viewsearchbypartyname").click(function () {
        var urls = "/" + fcode + "/CW/SearchByPartyName";
        location.href = urls;
    });
    $("#addsearchliveupdateicon").click(function () {
        openload();
        var url = "/" + fcode + "/CW/AddLiveUpdateManuallyCase";
        $('.LiveUpdateManuallybody').load(url, function (result) {
            closeload();
            $("#myModalLiveUpdateManually").modal({ show: true });
        });
    });
    $(document).on("click", "#ViewClientNoticeList", function () {
        var clientid = $(this).attr('value');
        var urls = "/" + fcode + "/NoticeReceived/ClientNoticeList";
        url_redirect({
            url: urls,
            method: "post",
            data: { ClientId: clientid }
        });
    });
    $('body').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        $(".typeahead").css("display", "none");
    });
    jQuery('#clearmember').click(function () {
        var $select = $("#addtaskmember3").selectize();
        var selectize = $select[0].selectize;
        selectize.clear();
        selectize.clearOptions();
    });
    var ischeckbocchecked = false;
    var checkfilename = "";
    var displayfilename = "";
    $(document).on("click", ".checkboxcls", function () {
        $('.checkboxcls').prop('checked', false);
        $(this).prop('checked', true);
        ischeckbocchecked = true
        checkfilename = $(this).val();
        displayfilename = $(this).attr('value');
    });
    $(document).on("click", "#sendmailbtn", function () {
        var noticeidd = $('.checkboxcls').attr('data-val');
        var filename = checkfilename;
        if (ischeckbocchecked == false) {
            alert("Please select any version of draft which you want to send on email.");
            return false;
        }
        var email = $("#receiverEmailidd").val();
        if (email != "") {
            if (email == "Other") {
                var othervalues = $("#receiverEmailiddother").val();
                if (othervalues == "") {
                    alert("Please enter EmailId");
                    return false;
                } else {
                    email = othervalues;
                }
            }
            if (IsEmailCorrect(email) == false) {
                alert("Please enter valid EmailId");
                return false;
            }
            $("#spanEmailId").hide();
            var formdata = new FormData();
            formdata.append('Id', noticeidd);
            formdata.append('receiverEmaill', email);
            formdata.append('filename', filename);
            formdata.append('displayfilename', displayfilename);
            $.ajax({
                type: "POST",
                url: "/api/NoticeNew/sendNoticeDraftOnMail",
                data: formdata,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.Data != null) {
                        alert(response.Data.message);
                        $("#receiverEmail").val("");
                        ischeckbocchecked = false;
                        checkfilename = "";
                        $("#NoticeDraftModal").modal('hide');
                    } else {
                        //alert("Something went wrong !");
                    }
                },
                error: function (err) {
                    alert(err.responseText)
                }
            })
        }
        else {
            $("#spanEmailId").show();
        }
    });
    function IsEmailCorrect(email) {
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test(email)) {
            return false;
        } else {
            return true;
        }
    }
    /*Remove task type*/
    $(document).on("click", "#DeleteTaskType", function () {
        if (confirm("Do you want to delete this task type?")) {
            var taskids = $(this).attr("ids");
            var formData = new FormData();
            formData.append("id", taskids);
            openload();
            $.ajax({
                url: '/api/CallApi/RemoveCustomCaseTask',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    LoadCustomTasktype();
                    bindTaskType();
                    closeload();
                }
            });
            return false;
        }
    });
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
        if (firstopenbrowse == true) {
            var defaultdid = 0;
            var url = "/firm/BrowseDirList/" + defaultdid + "?sttus=true&type=folder&module=" + tmodule;
            $('.loadbrowsedirlist').load(url, function (result) {
                closeload1();
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
            var url = "/firm/BrowseDirList/" + defaultdid + "?sttus=true&type=folder&module=" + tmodule;
            $('.loadbrowsedirlist').load(url, function (result) {
                closeload1();
                $('#myModalbrowsedocs').modal({ show: true });
                firstopenbrowse = false;
            });
        }
        else {
            $('#myModalbrowsedocs').modal({ show: true });
        }
    });
    /*Bundle pdf drive*/
    function BundlePDFDrive(bundlepdf) {
        openload();
        var formData = new FormData();
        formData.append("savemykasefileid", $("#mykasefileidbundlepdf").val());
        $.ajax({
            async: true,
            type: "POST",
            url: "/PDFMerge/UploadDrive",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Result != null) {
                    var path = data.Result;
                    if (data.Result == "FileAttachExceed") {
                        alert("Sorry! You have added more than 25 file. Pls remove some file(s)");
                        $("#browsefile" + bundlepdf).attr("title", "No file chosen");
                        $("#browsefilelbl" + bundlepdf).html("No file chosen");
                        $("#mykasefileid" + bundlepdf).val("");
                        closeload();
                        return false;
                    }
                    else if (data.Result == "NoFileAttach") {
                        alert("Please select the file to be uploaded.");
                        $("#browsefile" + bundlepdf).attr("title", "No file chosen");
                        $("#browsefilelbl" + bundlepdf).html("No file chosen");
                        $("#mykasefileid" + bundlepdf).val("");
                        closeload();
                        return false;
                    }
                    else if (data.Result == "ExtentionNotAllowed") {
                        alert("Please upload file having extensions .pdf only.");
                        $("#browsefile" + bundlepdf).attr("title", "No file chosen");
                        $("#browsefilelbl" + bundlepdf).html("No file chosen");
                        $("#mykasefileid" + bundlepdf).val("");
                        closeload();
                        return false;
                    }
                    else if (data.Result == "FileSizeExceed") {
                        alert("Document size greater than 20 MB cannot be accepted");
                        $("#browsefile" + bundlepdf).attr("title", "No file chosen");
                        $("#browsefilelbl" + bundlepdf).html("No file chosen");
                        $("#mykasefileid" + bundlepdf).val("");
                        closeload();
                        return false;
                    }
                    var str = data.Result;
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
    /*Compare two attachment*/
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
                    if (String(curentmodulefilename) == "TimeEntry") {
                        let fileName = "";
                        if (path) {
                            fileName = path.substring(path.lastIndexOf('/') + 1);
                        }
                        displayExistingTimeEntryFile(fileName, $("#mykasefileid" + curentmodulefilename).val());
                    }
                    if (String(curentmodulefilename) == "drafter") {
                        let fileName = "";
                        if (path) {
                            fileName = path.substring(path.lastIndexOf('/') + 1);
                        }
                        localStorage.setItem("pathDrafter", path);
                        //document.getElementById("uploadedFileName").innerText = fileName;
                        const fileNameLabel = document.getElementById("uploadedFileName");
                        const clearBtn = document.getElementById("clearDrafterFileBtn");

                        fileNameLabel.innerHTML = "<b>File Uploaded: </b> " + fileName;

                        clearBtn.style.display = "inline-block";
                        $('#drafterWrapper').hide();
                        $('#aiDraftChatPage').show();
                        $('#aiDraftInput').focus();
                    }
                    if (String(curentmodulefilename) == "aiTools") {
                        let fileName = "";
                        if (path) {
                            fileName = path.substring(path.lastIndexOf('/') + 1);
                        }
                        const fileList = $('#fileListAITools');
                        localStorage.setItem("pathAITools", path);
                        //fileList.empty();
                        displayExistingAddAITools(fileName);
                    }                    if (String(curentmodulefilename) == "task") {
                        let fileName = "";
                        if (path) {
                            fileName = path.substring(path.lastIndexOf('/') + 1);
                        }
                        const fileList = $('#fileList');
                        //fileList.empty();
                        displayExistingAddTask(fileName);
                    }
                    if (String(curentmodulefilename) == "communication") {
                        let fileName = "";
                        if (path) {
                            fileName = path.substring(path.lastIndexOf('/') + 1);
                        }
                        const fileList = $('#CommfileList');
                        //fileList.empty();
                        displayExistingAddCommunication(fileName, $("#mykasefileid" + curentmodulefilename).val());
                    }
                    if (String(curentmodulefilename) == "expense") {
                        let fileName = "";
                        if (path) {
                            fileName = path.substring(path.lastIndexOf('/') + 1);
                        }
                        const fileList = $('#fileListTMApplication');
                        //fileList.empty();
                        displayExistingAddExpense(fileName, $("#mykasefileid" + curentmodulefilename).val());
                    }
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
    var filenamesstring = [];
    /*Open browse folder*/
    $("#Openbrowsefolder").click(function (e) {
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
            //create runtime input type hidden jquery
            $("#mykasefileid" + curentmodulefilename).remove();
            $('#hiddenlist').append('<input type="text" name="mykasefileid' + curentmodulefilename + '" id="mykasefileid' + curentmodulefilename + '" value="' + fileidstring + '" />');
            if (String(curentmodulefilename) == "TimeEntry") {
                var urlcmopare11 = "/Compare/UploadFileFromDrive1"
                compareattachonetwo(curentmodulefilename, urlcmopare11, "one");

            }
            if (String(curentmodulefilename) == "task") {
                var urlcmopare11 = "/Compare/UploadFileFromDrive1"
                compareattachonetwo(curentmodulefilename, urlcmopare11, "one");

            }
            if (String(curentmodulefilename) == "communication") {
                var urlcmopare11 = "/Compare/UploadFileFromDrive1"
                compareattachonetwo(curentmodulefilename, urlcmopare11, "one");

            }
            if (String(curentmodulefilename) == "drafter") {
                var urlcmopare11 = "/Compare/UploadFileFromDrive1"
                compareattachonetwo(curentmodulefilename, urlcmopare11, "one");

            }
            // OCR: Show selected file names & preview in iFrame
            if (String(curentmodulefilename) == "ocr") {
                $('#selectedFileNameTab1').val('');
                document.getElementById("ocrPreviewFrameTab1").style.display = "none";
                document.getElementById("ocrPreviewContainerTab1").style.display = "none";
                document.getElementById("ocrPreviewFrameTab1").src = "";
                document.getElementById("previewIframeTab1").src = "";

                try {
                    document.getElementById("ocrPreviewContainerTab1").style.display = "block";
                    const fileNameField = document.getElementById("selectedFileNameTab1");
                    const previewContainer = document.getElementById("ocrPreviewContainerTab1");
                    const iframe = document.getElementById("ocrPreviewFrameTab1");

                    previewContainer.innerHTML = "";
                    fileNameField.value = filenamesstring.join(", ");
                    window.uploadedFileURLs = window.uploadedFileURLs || [];

                    if (filenamesstring.length > 1) {
                        alert("Sorry! You have added more than 1 file. Pls remove some file(s)");
                        $('#selectedFileNameTab1').val('');
                        document.getElementById("ocrPreviewFrameTab1").src = "";
                        document.getElementById("previewIframeTab1").src = "";
                        closeload();
                        return false;
                    }

                    orderItemsBrowse.forEach(function (file, index) {
                        let ext = file.Name.split('.').pop().toLowerCase();

                        const pdfExt = ["pdf"];
                        const imgExt = ["jpeg", "jpg", "png", "gif", "bmp", "webp", "tiff", "tif"];

                        if (pdfExt.includes(ext)) {
                            let apiEndpoint = "/Compare/UploadFileFromDrive1";
                            openload();
                            $('#overlayBackdrop').show();
                            var formData = new FormData();
                            formData.append("savemykasefileid", file.Id);

                            $.ajax({
                                url: apiEndpoint,
                                type: "POST",
                                data: formData,
                                contentType: false,
                                processData: false,
                                success: function (res) {
                                    if (res && res.Result) {
                                       /* renderMkFilesTab1(file && file.Name ? file.Name : "mykaseFile");*/
                                        let fileURL = res.Result;


                                        const fileName = (file && file.Name) ? file.Name : "mykaseFile";
                                        window.selectedFilesTab1 = window.selectedFilesTab1 || [];
                                        window.selectedFilesTab1.push({
                                            source: "mykase",
                                            id: file?.Id || file?.id || "",    
                                            name: fileName,
                                            downloadUrl: fileURL
                                        });
                                        renderMkFilesTab1();
                                        closeload();
                                        fetch(fileURL)
                                            .then(r => r.blob())
                                            .then(blob => {
                                                let fileName = file && file.Name ? file.Name : "mykaseFile";
                                                let fileExt = blob.type.split("/")[1] || "dat";
                                                const fileType = blob.type || "application/pdf";
                                                const fileObj = new File([blob], fileName, { type: fileType });
                                                let fullName = fileName.includes(".") ? fileName : fileName + "." + fileExt;
                                                setFilesToInput([fileObj]);
                                            });
                                        $('#overlayBackdrop').hide();
                                        window.uploadedFileURLs.push({ name: file.Name, url: fileURL });

                                        if (index === 0) {
                                            iframe.src = fileURL;
                                            iframe.style.display = "block";
                                            return;
                                        }

                                        let previewElement = document.createElement("iframe");
                                        previewElement.src = fileURL;
                                        previewElement.width = "100%";
                                        previewElement.height = "400px";
                                        previewElement.style.border = "1px solid #ccc";
                                        previewElement.className = "mb-3";

                                        const wrapper = document.createElement("div");
                                        wrapper.className = "file-preview mb-4";
                                        wrapper.appendChild(previewElement);
                                        previewContainer.appendChild(wrapper);
                                    }
                                },
                                error: function (err) {
                                    console.error("Error fetching file URL:", err);
                                }
                            });
                        } else if (imgExt.includes(ext)) {
                            let objectURL = document.getElementById("getnextlevel").getAttribute("dir-path") || "";
                            if (!objectURL) {
                                alert("Image file URL not available!");
                                return;
                            }

                            if (index === 0) {
                                iframe.src = objectURL;
                                iframe.style.display = "block";
                                return;
                            }

                            let previewElement = document.createElement("img");
                            previewElement.src = objectURL;
                            previewElement.style.maxWidth = "100%";
                            previewElement.style.maxHeight = "300px";
                            previewElement.style.marginBottom = "15px";
                            previewElement.style.display = "block";

                            const wrapper = document.createElement("div");
                            wrapper.className = "file-preview mb-4";
                            wrapper.appendChild(previewElement);
                            previewContainer.appendChild(wrapper);
                        } else {
                            alert("Extension Not Allowed: " + file.Name);
                            $('#selectedFileNameTab1').val('');
                            document.getElementById("ocrPreviewFrameTab1").style.display = "none";
                            document.getElementById("ocrPreviewContainerTab1").style.display = "none";
                            document.getElementById("ocrPreviewFrameTab1").src = "";
                            document.getElementById("previewIframeTab1").src = "";
                        }
                    });
                } catch (err) {
                    console.error("Preview logic error:", err);
                }
            }
            // OCR Logic Ends 
            // ========================================================

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
            else if (String(curentmodulefilename) == "expense") {
                var urlcmopare11 = "/Compare/UploadFileFromDrive1"
                let selectedpostedFile = [];
                compareattachonetwo(curentmodulefilename, urlcmopare11, "one");
            }
 if (String(curentmodulefilename) == "aiTools") {
                var urlcmopare12 = "/Compare/UploadFileFromDrive2"
                compareattachonetwo(curentmodulefilename, urlcmopare12, "two");
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
    /*Load browse directory list*/
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
    /**Browser list*/
    function GeneratedBrowseList() {
        if (orderItemsBrowse.length > 0) {
            var $table4 = $('<table id="tablebrowseselect" class="table-panel"/>');
            $table4.append('<thead><tr><th>Name</th><th style="text-align:center;">Action</th></thead>');
            var $tbody4 = $('<tbody/>');
            $.each(orderItemsBrowse, function (i, val) {
                var $row4 = $('<tr/>');
                $row4.append($('<td/>').html(val.Name));
                var $remove4 = $('<a href="#" style="display:block; text-align:center;"><img src="/newassets/img/darkdelete.svg" id="loadbrowsedirlist" title="Delete" dir-val="' + val.Id + '" dir-name="' + val.Name + '" /></a>');
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
    //LoadCustomTasktype();
    function LoadCustomTasktype() {
        var html = '';
        $("#assignuserdatatasktype").html("");
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomCaseTask",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                if (obj == null) {
                    $("#tasktypestatus").show();
                }
                else {
                    $("#tasktypestatus").hide();
                }
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html += '<tr><td class="CustomerId"><span style="display:none">' + a.Id + '</span>' + qty1 + '</td><td class="Name"><span>' + a.CaseTaskName + '</span> <input type="text" class="form-control" value="' + a.CaseTaskName + '" style="display:none" /></td><td><a class="" href="javascript:;" style="display:none">Edit</a><a class="Update btn btn-info btn-mail" href="javascript:;" style="display:none">Update</a> <a class="Cancel btn btn-default btn-mail" href="javascript:;" style="display:none">Cancel</a>&nbsp;  <a class="" href="javascript:;"><span  style="color:Red" class="glyphicon glyphicon-trash" id="DeleteTaskType" ids="' + a.Id + '" title="Delete task type"></span></a></td></tr>';
                });
                $("#assignuserdatatasktype").append(html);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    /*Add task type*/
    $("#btnAddTaskType").click(function () {
        try {
            var formData = new FormData();
            var txtName = $("#txtName").val();
            if (txtName == "") {
                alert("Please select from the list the type of contact you wish to add.");
                return false;
            }
            formData.append("SubjectName", txtName.trim());
            openload();
            $.ajax({
                url: '/api/CallApi/InsertCustomCaseTask',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Data != "-1") {
                        new PNotify({
                            title: 'Success',
                            text: 'Data saved Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        LoadCustomTasktype();
                        $("#txtName").val("");
                        bindTaskType();
                        closeload();
                    }
                    else {
                        new PNotify({
                            title: 'Warning',
                            text: 'Task Type already exists.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    return false;
                }
            });
        }
        catch (er) {
            alert(er.message);
            closeload();
        }
    });
    $("#tasktype").change(function () {
        if (userrolesids == "1") {
            var values = $(this).val();
            if (values == "Others") {
                $("#myModaltasktype").modal();
            }
        }
    });
    $("#item").change(function () {
        if (userrolesids == "1") {
            var values = $(this).val();
            if (values == "Others") {
                $("#myModaltasktype1").modal();
            }
        }
    });
    //addtaskmember();
    $(document).on("click", "#DeleteTask", function () {
        if (confirm("Do you want to delete this task?")) {
            var taskids = $(this).attr("ids");
            var formData = new FormData();
            formData.append("id", taskids);
            openload();
            $.ajax({
                url: '/api/CallApi/RemoveCustomTask',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    LoadCustomsTask();
                    bindTask();
                    closeload();
                }
            });
            return false;
        }
    });
    //Load custom task
    function LoadCustomsTask() {
        var html = '';
        $("#assignuserdatafortask").html("");
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomTask",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                if (obj == null) {
                    $("#taskstatuss").show();
                }
                else {
                    $("#taskstatuss").hide();
                }
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html += '<tr><td class="CustomerId"><span style="display:none">' + a.Id + '</span>' + qty1 + '</td><td class="Name"><span>' + a.CaseTaskName + '</span> <input type="text" class="form-control" value="' + a.CaseTaskName + '" style="display:none" /></td><td><a class="" href="javascript:;" style="display:none">Edit</a><a class="Update btn btn-info btn-mail" href="javascript:;" style="display:none">Update</a> <a class="Cancel btn btn-default btn-mail" href="javascript:;" style="display:none">Cancel</a>&nbsp;  <a class="" href="javascript:;"><span id="DeleteTask" ids="' + a.Id + '" title="Delete task"><img src="/newassets/img/deletecasesingle-icon.png" /></span></a></td></tr>';
                });
                $("#assignuserdatafortask").append(html);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    $("#btnAddTask").click(function () {
        try {
            var formData = new FormData();
            var txtName = $("#taskName").val();
            if (txtName == "") {
                alert("Please enter task");
                return false;
            }
            formData.append("SubjectName", txtName.trim());
            openload();
            $.ajax({
                url: '/api/CallApi/InsertCustomTask',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Data != "-1") {
                        new PNotify({
                            title: 'Success',
                            text: 'Data saved Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        LoadCustomsTask();
                        $("#taskName").val("");
                        bindTask();
                        closeload();
                    }
                    else {
                        new PNotify({
                            title: 'Warning',
                            text: 'Task Type already exists.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    return false;
                }
            });
        }
        catch (er) {
            alert(er.message);
            closeload();
        }
    });
    $(document).on("change", "#casecasetype", function () {
        var casecasetype1 = $("#casecasetype").val();
        var SidecaseNames = $("#sideCasename").val();

        if (casecasetype1 == "42") {
            //if (SidecaseNames == "") {
            //    alert("Please enter the matter name.");
            //    $("#casecasetype").val('');
            //    return false;
            //}
            $("#divmanamecnf").text(SidecaseNames);
            $('#myModalAddLiveUpdateconfirmation').modal('show');
            //$("#tracksearchcase").show();
            //$("#clientdivcommon4").css("display", "block");
        }
        else {
            $("#myModalAddLiveUpdateconfirmation").modal('hide');
            // $("#tracksearchcase").hide();
            // $("#clientdivcommon4").css("display", "none");
        }
    });
    $(document).on("change", "#shortselectusertype", function () {
        var ele = document.getElementsByName('shortselectusertype');
        var userType;
        for (i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                userType = ele[i].value;
            }
        }
        if (userType == "company") {
            $("#commoncompanynamediv").show();
            $("#commonothercompany").hide();
            $("#commancompanyname").show();
            $("#sideothercompanyname,#commancompanyname").val("");
        }
        else {
            $("#commoncompanynamediv,#commonothercompany").hide();
            $("#sideothercompanyname,#commancompanyname").val("");
        }
    });

    $(document).on("change", "input[name='selectusertype']", function () {
        var ele = document.getElementsByName('selectusertype');
        var userType;
        for (i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                userType = ele[i].value;
            }
        }
        if (userType == "company") {
            $("#clientcontactdiv").show();
        }
        else {
            $("#clientcontactdiv").hide();
        }
    });
    $('div .dropdown-menu').on('click', function (e) {
        $(".dropdown-menushowhid").css("height", "100px !important;")
        // The event won't be propagated up to the document NODE and
        // therefore delegated events won't be fired
        if (e.target.className == "chktaskmembergroups1") {
            $(".taskmembercls1").prop('checked', $("#chktaskmembergroups1").prop('checked'));
            var favorite = [];
            var i = 0;
            var chkname = '';
            $.each($("input[id='chkTaskgroup1']:checked"), function () {
                if (chkname == "") {
                    chkname = $(this).attr("tempusername");
                }
                i = i + 1;
            });
            if (i == 0) {
                $("#lblTeammemberSelect1").text("Select");
                chkname = "";
            }
            else {
                if (i > 1) {
                    $("#lblTeammemberSelect1").text("All");
                }
                else {
                    $("#lblTeammemberSelect1").text("Selected (" + chkname + ")");
                }
            }
        }
        if (e.target.className == "chktaskmembergroups") {
            $(".taskmembercls").prop('checked', $("#chktaskmembergroups").prop('checked'));
            var favorite = [];
            var i = 0;
            var chkname = '';
            $.each($("input[id='chkTaskgroup']:checked"), function () {
                if (chkname == "") {
                    chkname = $(this).attr("tempusername");
                }
                i = i + 1;
            });
            if (i == 0) {
                $("#lblTeammemberSelect").text("Select");
                chkname = "";
            }
            else {
                if (i > 1) {
                    $("#lblTeammemberSelect").text("All");
                }
                else {
                    $("#lblTeammemberSelect").text("Selected (" + chkname + ")");
                }
            }
        }
        if (e.target.className == "taskmemberclssharedocs") {
            $(".taskmemberclssharedocs").prop('checked', $("#chkTaskgroupsharedoc").prop('checked'));
            var favorite = [];
            var i = 0;
            var chkname = '';
            $.each($("input[id='chkTaskgroupsharedoc']:checked"), function () {
                if (chkname == "") {
                    chkname = $(this).attr("tempusername");
                }
                i = i + 1;
            });
            if (i == 0) {
                $("#lblTeammemberSelectsharedocs").text("Select");
                chkname = "";
            }
            else {
                if (i > 1) {
                    $("#lblTeammemberSelectsharedocs").text("All");
                }
                else {
                    $("#lblTeammemberSelectsharedocs").text("Selected (" + chkname + ")");
                }
            }
        }
    });
    $(document).on('change', '#chkUsercase', function () {
        var favorite = [];
        var i = 0;
        $.each($("input[id='chkUsercase']:checked"), function () {
            i = i + 1;
        });
        if (i == 0) {
            $("#caseuserlabel").text("Select");
        }
        else {
            $("#caseuserlabel").text("Selected (" + i + ")");
        }
    });
    $(document).on('change', '#chkUserrightsteam', function () {
        var favorite = [];
        var i = 0;
        $.each($("input[id='chkUserrightsteam']:checked"), function () {
            i = i + 1;
        });
        if (i == 0) {
            $("#userrightslabel").text("Select");
        }
        else {
            $("#userrightslabel").text("Selected (" + i + ")");
        }
    });
    $(document).on('change', '#chkUsergroupteam', function () {
        var favorite = [];
        var i = 0;
        $.each($("input[id='chkUsergroupteam']:checked"), function () {
            i = i + 1;
        });
        if (i == 0) {
            $("#usergrouplabel").text("Select");
        }
        else {
            $("#usergrouplabel").text("Selected (" + i + ")");
        }
    });
    $(document).on('change', '#chkUsergroup', function () {
        var favorite = [];
        var i = 0;
        $.each($("input[id='chkUsergroup']:checked"), function () {
            i = i + 1;
        });
        if (i == 0) {
            $("#lblTeammemberSelectlimit").text("Select");
        }
        else {
            $("#lblTeammemberSelectlimit").text("Selected (" + i + ")");
        }
    });
    $(document).on('change', '#chkUsergroupml', function () {
        var favorite = [];
        var i = 0;
        $.each($("input[id='chkUsergroupml']:checked"), function () {
            i = i + 1;
        });
        if (i == 0) {
            $("#lblTeammemberSelectlimitmanual").text("Select");
        }
        else {
            $("#lblTeammemberSelectlimitmanual").text("Selected (" + i + ")");
        }
    });
    $(document).on('change', '#chkTaskgroup', function () {
        var favorite = [];
        var i = 0;
        var chkname = '';
        $.each($("input[id='chkTaskgroup']:checked"), function () {
            if (chkname == "") {
                chkname = $(this).attr("tempusername");
            }
            i = i + 1;
        });
        if (i == 0) {
            $("#lblTeammemberSelect").text("Select");
            chkname = "";
        }
        else {
            if (chkname.length > 8) {
                chkname = chkname.substring(0, 8) + "...";
            }
            else {
            }
            if (i > 1) {
                $("#lblTeammemberSelect").text("Selected (" + chkname + " +)");
            }
            else {
                $("#lblTeammemberSelect").text("Selected (" + chkname + ")");
            }
        }
    });
    $(document).on('change', '#chkTaskgroup1', function () {
        var favorite = [];
        var i = 0;
        var chkname = '';
        $.each($("input[id='chkTaskgroup1']:checked"), function () {
            if (chkname == "") {
                chkname = $(this).attr("tempusername");
            }
            i = i + 1;
        });
        if (i == 0) {
            $("#lblTeammemberSelect1").text("Select");
            chkname = "";
        }
        else {
            if (chkname.length > 8) {
                chkname = chkname.substring(0, 8) + "...";
            }
            else {
            }
            if (i > 1) {
                $("#lblTeammemberSelect1").text("Selected (" + chkname + " +)");
            }
            else {
                $("#lblTeammemberSelect1").text("Selected (" + chkname + ")");
            }
        }
    });
    $(document).on('change', '#chkTaskgroupsharedoc', function () {
        var favorite = [];
        var i = 0;
        var chkname = '';
        $.each($("input[id='chkTaskgroupsharedoc']:checked"), function () {
            if (chkname == "") {
                chkname = $(this).attr("tempusername");
            }
            i = i + 1;
        });
        if (i == 0) {
            $("#lblTeammemberSelectsharedocs").text("Select");
            chkname = "";
        }
        else {
            if (chkname.length > 30) {
                chkname = chkname.substring(0, 30) + "...";
            }
            else {
            }
            if (i > 1) {
                $("#lblTeammemberSelectsharedocs").text("Selected (" + chkname + " +)");
            }
            else {
                $("#lblTeammemberSelectsharedocs").text("Selected (" + chkname + ")");
            }
        }
    });
    $("#taskduedate").change(function () {
        $('#actionbydate').attr('max', $("#taskduedate").val());
    });
    $("#etaskduedate").change(function () {
        $('#eactionbydate').attr('max', $("#etaskduedate").val());
    });
    bindCommonDropdown("Timeentrytype", "TimeEntry_Type", 'Select');
    /*Bind common dropdown*/
    function bindCommonDropdown(controlname, dropdownname, selecttext) {
        var html1 = '<option value="">' + selecttext + '</option>';
        var formData = new FormData();
        formData.append("dropdownname", dropdownname);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCommonDropdown",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $.each(response.Data, function (i, a) {
                    html1 += '<option value="' + a.iid + '" >  ' + a.Name + '</option>';
                    $("#" + controlname).html(html1);
                });
            },
            failure: function (response) { },
            error: function (response) { }
        });
    }
    /*Report manager details*/
    function Reportmanager() {
        $("#member").html("");
        var optio2n = '<option value="" >Select</option>';
        var optio2n2 = '<option value="" >From User</option>';
        var optio2n3 = '<option value="" >To User</option>';
        $("#FromWorkUser,#ToWorkUser,#FromWorkUserNew").append(optio2n);
        $("#FilterFromWorkUser").append(optio2n2);
        $("#FilterToWorkUser").append(optio2n3);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/AssignReportManager",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    try {
                        var obj = JSON.parse(response.Data);
                    }
                    catch
                    {
                    }
                }
                try {
                    var html3 = '';
                    $.each(obj, function (i, a) {
                        if (a.roleid == 1) {
                            var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                            $("#casefilterTTAssignBy,#casefilterTTAssignTo,#casefilterCreatedBy,#rmanager,#fcaseteamlead,#caseteamlead,#filteruserschedule,#filteruserscheduleby,#filteruserscheduleto,#afilteruserto,#ofilteruserscheduleto,#dfilteruserto,#ifilteruserto,#filtercaseuserarchive,#filtercaseusermatter,#filteruserdocument").append(option);
                        }
                        else {
                            if (a.IsPartner == 1) {
                                var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                                $("#casefilterTTAssignBy,#casefilterTTAssignTo,#casefilterCreatedBy,#rmanager,#fcaseteamlead,#caseteamlead,#filteruserschedule,#filteruserscheduleby,#filteruserscheduleto,#afilteruserto,#ofilteruserscheduleto,#dfilteruserto,#ifilteruserto,#filtercaseuserarchive,#filtercaseusermatter,#filteruserdocument").append(option);
                                $("#FromWorkUser,#ToWorkUser,#FilterFromWorkUser,#FilterToWorkUser,#FromWorkUserNew").append(option);
                            }
                            else {
                                if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                                    $("#casefilterTTAssignBy,#casefilterTTAssignTo,#casefilterCreatedBy,#rmanager,#fcaseteamlead,#caseteamlead,#filteruserschedule,#filteruserscheduleby,#filteruserscheduleto,#afilteruserto,#ofilteruserscheduleto,#dfilteruserto,#ifilteruserto,#filtercaseuserarchive,#filtercaseusermatter,#filteruserdocument").append(option);
                                    $("#FromWorkUser,#ToWorkUser,#FilterFromWorkUser,#FilterToWorkUser,#FromWorkUserNew").append(option);
                                }
                                else {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                                    $("#casefilterTTAssignBy,#casefilterTTAssignTo,#casefilterCreatedBy,#rmanager,#fcaseteamlead,#caseteamlead,#filteruserschedule,#filteruserscheduleby,#filteruserscheduleto,#afilteruserto,#ofilteruserscheduleto,#dfilteruserto,#ifilteruserto,#filtercaseuserarchive,#filtercaseusermatter,#filteruserdocument").append(option);
                                    $("#FromWorkUser,#ToWorkUser,#FilterFromWorkUser,#FilterToWorkUser,#FromWorkUserNew").append(option);
                                }
                            }
                        }
                    });
                }
                catch
                {
                }
                return false;
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*Add task member*/
    function addtaskmember() {
		openload();
        $("#addtaskmember,#addtaskmember_new").html("");
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/TeamMemberbyFirmId",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                var html3 = '';
                $.each(obj, function (i, a) {
                    if (a.roleid == 1) {
                        $("#addtaskmember,#addtaskmember_new").append($("<option></option>").val(a.id).text(a.UserName + '(Admin)'));
                        //html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="#" class="dropdown-item">' + a["UserName"] + '(Admin)</a></li>'
                    }
                    else {
                        if (a.IsPartner == 1) {
                            $("#addtaskmember,#addtaskmember_new").append($("<option></option>").val(a.id).text(a.UserName + '(' + a.RoleName + ')'));
                            // html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(' + a.RoleName + ')</a></li>'
                        }
                        else {
                            if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                                //  html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(User)</a></li>'
                                $("#addtaskmember,#addtaskmember_new").append($("<option></option>").val(a.id).text(a.UserName + '(User)'));
                            }
                            else {
                                // html3 += '<li ddd><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + ' - (User ' + a.PartnerName + ')</a></li>'
                                $("#addtaskmember,#addtaskmember_new").append($("<option></option>").val(a.id).text(a.UserName + ' - (User ' + a.PartnerName + ')'));
                            }
                        }
                    }
                });
                // $("#addtaskmember").html("");
                //  $("#addtaskmember").append(html3);
                // $("#addtaskmember").css("height", "220px !important");
		//		closeload();
                $("#addtaskmember,#addtaskmember_new").multiselect('reload');
                return false;
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                //alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                //alert(response.responseText);
            } //End of AJAX error function
        });
    }
    /*Load team leader*/
	window.userIds = [];
    window.userMap = {};    /*Load team leader*/
    function loadteamleader() {
        $("#member").html("");
        $("#ddlUsersRights").empty().append('<option value="" selected>Select All</option>');
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/Assignuserteamlead",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                var html3 = '';
                $.each(obj, function (i, a) {
                    window.userIds.push(a.id);          
                    window.userMap[a.id] = a.UserName + '(' + a.RoleName + ')';  
                    if (a.roleid == 1) {
                        var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                        $("#emember,#rmember,#dusers,#filtercaseuser,#cdcfiltercreateby,#ddlExpenceTeamMember,#contacttype,#ddlExpUser,#UserAlertOnOff,#UserListAlertDays,#ddlExpenseCreatedForFilter").append(option);
                        html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="#" class="dropdown-item">' + a["UserName"] + '(Admin)</a></li>'
                    }
                    else {
                        if (a.IsPartner == 1) {
                            var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                            $("#emember,#rmember,#dusers,#filtercaseuser,#cdcfiltercreateby,#ddlExpenceTeamMember,#contacttype,#ddlExpUser,#cdcfilteralertto,#ddlUsersRights,#UserAlertOnOff,#UserListAlertDays,#ddlExpenseCreatedForFilter").append(option);
                            html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(' + a.RoleName + ')</a></li>'
                        }
                        else {
                            if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                                if (a.roleid == 3) {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '(' + a.RoleName + ')</option>';
                                    $("#emember,#rmember,#dusers,#filtercaseuser,#cdcfiltercreateby,#ddlExpenceTeamMember,#contacttype,#ddlExpUser,#cdcfilteralertto,#ddlUsersRights,#UserAlertOnOff,#UserListAlertDays,#ddlExpenseCreatedForFilter").append(option);
                                    html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + ' (' + a.RoleName + ')</a></li>'
                                }
                                else {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                                    $("#emember,#rmember,#dusers,#filtercaseuser,#cdcfiltercreateby,#ddlExpenceTeamMember,#contacttype,#ddlExpUser,#cdcfilteralertto,#ddlUsersRights,#UserAlertOnOff,#UserListAlertDays,#ddlExpenseCreatedForFilter").append(option);
                                    html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(User)</a></li>'
                                }
                            }
                            else {
                                if (a.roleid == 3) {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '(' + a.RoleName + ')</option>';
                                    $("#emember,#rmember,#dusers,#filtercaseuser,#cdcfiltercreateby,#ddlExpenceTeamMember,#contacttype,#ddlExpUser,#cdcfilteralertto,#ddlUsersRights,#UserAlertOnOff,#UserListAlertDays,#ddlExpenseCreatedForFilter").append(option);
                                    html3 += '<li ddd><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + ' (' + a.RoleName + ')</a></li>'
                                }
                                else {
                                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                                    $("#emember,#rmember,#dusers,#filtercaseuser,#cdcfiltercreateby,#ddlExpenceTeamMember,#contacttype,#ddlExpUser,#cdcfilteralertto,#ddlUsersRights,#UserAlertOnOff,#UserListAlertDays,#ddlExpenseCreatedForFilter").append(option);
                                    html3 += '<li ddd><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + ' - (User ' + a.PartnerName + ')</a></li>'
                                }
                            }
                        }
                    }
                });
                $("#member").html("");
                $("#member").append(html3);
                $("#member").css("height", "100px !Important");
                $("#dropdownMenuButton").prop("disabled", false);
                //setTimeout(function () {
                //    closeload();
                //}, 1000);

                return false;
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                // alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                // alert(response.responseText);
            } //End of AJAX error function
        });
    }

    /*Assign users*/
    function loadUser() {
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
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '</option>';
                    $("#statuteuser,#author").append(option);
                    try {
                        if (a.IsPartner == "1") {
                            $("#rpartner").append(option);
                            var option1 = '<option value="' + a["Id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '</option>';
                            $("#teamtype,#teamtypeedit").append(option1);
                            if (a.Id == userid) {
                                $('select#teamtype option[value="' + a["Id"] + '"]').attr("selected", true);
                                $('select#teamtypeedit option[value="' + a["Id"] + '"]').attr("selected", true);
                            }
                            else {
                                try {
                                    if (userroleid != "1") {
                                        $('select#teamtype option[value="2"]').attr("selected", true);
                                        $('select#teamtypeedit option[value="2"]').attr("selected", true);
                                    }
                                }
                                catch {
                                }
                            }
                        }
                    }
                    catch (er) {
                        // alert(er.message);
                    }
                });
                $("#teamtype").change();
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                //alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                //alert(response.responseText);
            } //End of AJAX error function
        });
    }
    /*Load case users*/
    function loadCaseUser(caseid, target) {
        // $("ul #addtaskmember").css("height", "220 !Important");
        $("#addtaskmember").val('');
        $(target).empty();
        var companyid = $("#commucompanyidsnamethide").val();
        var optiont = "";
        var optiont3 = "";
        if (target == "#member") {
            var optiont1 = '<li><input id="chktaskmembergroups" type="checkbox" class="chktaskmembergroups"  value="" ><a href="#" class="dropdown-item">All Members</a></li>';
            $(target).append(optiont1);
        }
        else if (target == "#addtaskmember_new") {
            var optiont1 = '<li><input id="chktaskmembergroups" type="checkbox" class="chktaskmembergroups"  value="" ><a href="#" class="dropdown-item">All Members</a></li>';
            $(target).append(optiont1);
        }
        //else if (target == "#addtaskmember") {
        //     optiont1 = '<option value="" >All Members</option>';
        //    //var optiont1 = '<li><input id="chktaskmembergroups" type="checkbox" class="chktaskmembergroups"  value="" ><a href="#" class="dropdown-item">All Members</a></li>';
        //    $(target).append(optiont1);
        //}
        //else if (target == "#alertmember") {
        //    optiont3 = '<option value="" >All Members</option>';
        //   // var optiont1 = '<li><input id="chktaskmembergroups1" type="checkbox" class="chktaskmembergroups1"  value="" ><a href="#" class="dropdown-item">All Members</a></li>';
        //    $(target).append(optiont3);
        //}
        else {
            //var optiont1 = '<option value="" >Select</option>';
            //$(target).append(optiont1);
        }
        if (target == "#alertmember") {
            $(target).append(optiont);
            var clientds = $("#commuclienthide").val();
            var clientdnames = $("#commucliennamethide").val();
            if (String(companyid) == "00000000-0000-0000-0000-000000000000") {
                if (clientds != "00000000-0000-0000-0000-000000000000") {
                    $('#alertmember').append($("<option></option>").val(clientds).text(clientdnames));
                    // $('#alertmember').append('<li><input id="chkTaskgroup1" type="checkbox" class="shcheckbox1 taskmembercls1" name="fname"  tempUserName="' + clientdnames + '" value="' + clientds + '" ><a href="#" class="dropdown-item">' + clientdnames + '</a></li>');
                }
            }
        }
        if (target == "#alertmember" && String(companyid) != "00000000-0000-0000-0000-000000000000") {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/BindCaseAssignuserCommunication",
                headers: {
                    "caseid": caseid,
                    "companyid": companyid
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                    }
                    var html3 = '';
                    $.each(obj, function (i, a) {
                        //html3 += '<li><input id="chkTaskgroup1" type="checkbox" class="shcheckbox1 taskmembercls1" tempUserName=" ' + a["UserId"] + '" name="fname" value="' + a["auser"] + '" ><a href="#" class="dropdown-item">' + a["UserId"] + '</a></li>'
                        $(target).append($("<option></option>").val(a.auser).text(a.UserId));
                    });
                    $("#alertmember").multiselect('reload');
                    //$(target).append(html3);
                    //End of foreach Loop
                    //console.log(response);
                }, //End of AJAX Success function
                failure: function (response) {
                    //alert(response.responseText);
                }, //End of AJAX failure function
                error: function (response) {
                    // alert(response.responseText);
                } //End of AJAX error function
            });
        }
        else {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/CallApi/BindCaseAssignuser",
                headers: {
                    "caseid": caseid
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        var obj = JSON.parse(response.Data);
                    }
                    var html3 = '';
                    var option2 = '';
                    var option3 = '';
                    var option4 = '';
                    $("#addtaskmember_new").empty();
                    $.each(obj, function (i, a) {
                        if (target == "#member") {
                            html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" tempUserName=" ' + a["UserId"] + '" name="fname" value="' + a["auser"] + '" ><a href="#" class="dropdown-item">' + a["UserId"] + '</a></li>'
                        }
                        else if (target == "#addtaskmember") {
                            //  html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" tempUserName=" ' + a["UserId"] + '" name="fname" value="' + a["auser"] + '" ><a href="#" class="dropdown-item">' + a["UserId"] + '</a></li>'
                            option2 += '<option value="' + a["auser"] + '" > ' + a["UserId"] + '</option>';

                        }
                        else if (target == "#addtaskmember_new") {
                            option4 += '<option value="' + a["auser"] + '" > ' + a["UserId"] + '</option>';
                            //html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" tempUserName=" ' + a["UserId"] + '" name="fname" value="' + a["auser"] + '" ><a href="#" class="dropdown-item">' + a["UserId"] + '</a></li>'

                        }
                        else if (target == "#alertmember") {
                            option3 += '<option value="' + a["auser"] + '" > ' + a["UserId"] + '</option>';
                            //  $(target).append(option);
                            // html3 += '<li><input id="chkTaskgroup1" type="checkbox" class="shcheckbox1 taskmembercls1" tempUserName=" ' + a["UserId"] + '" name="fname" value="' + a["auser"] + '" ><a href="#" class="dropdown-item">' + a["UserId"] + '</a></li>'
                        }
                        else {
                            var option = '<option value="' + a["auser"] + '" > ' + a["UserId"] + '</option>';
                            $(target).append(option);
                        }
                    });
                    $(target).append(html3);
                    $(target).append(option2);
                    $(target).append(option3);
                    $(target).append(option4);
                    $("#addtaskmember").multiselect('reload');
                    $("#alertmember").multiselect('reload');
                    $("#addtaskmember_new").multiselect('reload');
                    //End of foreach Loop
                    //console.log(response);
                }, //End of AJAX Success function
                failure: function (response) {
                    //alert(response.responseText);
                }, //End of AJAX failure function
                error: function (response) {
                    // alert(response.responseText);
                } //End of AJAX error function
            });
        }
    }
    /*Load company details*/
    function loadCompany() {
        var optiont = '<option value="" selected="">Select</option>';
        var optiont1 = '<option value="Others" style="font-weight:bold;color:#069;font-size:11px;">ADD NEW COMPANY</option>';
        $("#commancompanyname").empty();
        $("#commancompanyname").append(optiont);
        $("#commancompanyname").append(optiont1);
        try {
            $("#cocomanyname").empty();
            $("#cocomanyname").append(optiont);
            $("#cocomanyname").append(optiont1);
        }
        catch (er) {
        }
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/BindContactCompany",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["ID"] + '" >' + a["CompanyName"] + '</option>';
                    $("#commancompanyname").append(option);
                    try {
                        $("#cocomanyname").append(option);
                    }
                    catch (er) {
                    }
                });
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                // alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                // alert(response.responseText);
            } //End of AJAX error function
        });
    }
    //-------start coding for delete contact type------------
    $(document).on("click", "#DeleteContactType", function () {
        if (confirm("Do you want to delete this contact type?")) {
            var taskids = $(this).attr("ids");
            var formData = new FormData();
            formData.append("id", taskids);
            openload();
            $.ajax({
                url: '/api/CallApi/RemoveCustomContactType',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Data == "-1") {
                        alert("Data Could not be Removed. it's used in system.")
                    }
                    else {
                        alert("Data Remove Successfully")
                    }
                    loadContacttype();
                    LoadCustomsContactType();
                    closeload();
                }
            });
            return false;
        }
    });
    /*Add contact type*/
    $("#btnAddContactType").click(function () {
        var formData = new FormData();
        var txtName1 = $("#Contacttypes2").val();
        if (txtName1 == "") {
            alert("Please select from the list the type of contact you wish to add.");
            return false;
        }
        formData.append("Contacttype", txtName1.trim());
        openload();
        $.ajax({
            url: '/api/CallApi/InsertCustomTask1',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Data != "-1") {
                    new PNotify({
                        title: 'Success',
                        text: 'Data saved Successfully',
                        type: 'success',
                        delay: 3000
                    });
                    $("#Contacttypes2").val("");
                    loadContacttype();
                    LoadCustomsContactType();
                    closeload();
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: 'Contact Type already exists.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                return false;
                closeload();
            }
        });
    });
    /*Load custom contact type*/
    function LoadCustomsContactType() {
        var html = '';
        $("#assignuserdataforcontactType").html("");
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomContactType",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                if (obj == null) {
                    $("#contacttypetatuss").show();
                }
                else {
                    $("#contacttypetatuss").hide();
                }
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html += "<tr>";
                    html += "<td class='CustomerId'><span style='display: none'>" + a.Id + "</span>" + qty1 + "</td>";
                    html += "<td class='Name'><span>" + a.ContactType + "</span> <input type='text' class='form-control' value=" + a.ContactType + " style='display: none' /></td>";
                    if (userrolesids == "1") {
                        html += "<td><a class='' href='javascript: ;'><span  style='color: Red' class='glyphicon glyphicon-trash' id='DeleteContactType' ids=" + a.Id + " title='Delete contact type'></span></a></td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    html += "</tr>";
                });
                $("#assignuserdataforcontactType").append(html);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    //---------------------/END Contact Type------------------------------
    /*Load contact type*/
    function loadContacttype() {
        $("#commoncontacttype").empty();
        try {
            $("#coctype").empty();
        }
        catch (er) {
        }
        try {
            $("#Clistctype").empty();
            $("#Clistctype").removeAttr("disabled");
        }
        catch (er) {
        }
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/BindContactsType",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }

                //var optiont11 = '<option value="">Select </option>';
                //$("#commoncontacttype,#coctype").append(optiont11);
                var all = '<option value="all" selected="selected" >All</option>';
                $("#Clistctype").append(all);
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >' + a["ProfileType"] + '</option>';
                    if (a["ProfileType"] == "Others") {
                        $("#commoncontacttype,#coctype").append(option);
                    }
                    else {
                        $("#commoncontacttype,#coctype,#Clistctype,#Clistctypeaddress,#ClistctypeaddressFilter").append(option);
                        if (a["ProfileType"] != "Client") {
                            var option3 = '<option value="' + a["Id"] + '" >' + a["ProfileType"] + '</option>';
                            $("#ecoctype").append(option3);
                        }
                    }
                });
                ;
                //End of foreach Loop
                //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                // alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                //  alert(response.responseText);
            } //End of AJAX error function
        });
        closeload();
    }
    $("#sidebindcommucase").change(function () {
        var clientds = $("#sidebindcommucase").val();
        if (clientds != "") {
            loadCaseUser(clientds, "#alertmember");
        }
        else {
            $("#alertmember").empty();
            loadteamleader();
        }
    });
    /*Load case user on matter change*/
    $("#matter").change(function () {
        var clientds = $("#matter").val();
        if (clientds != "") {
            loadCaseUser(clientds, "#member");
            loadCaseUser(clientds, "#addtaskmember_new");
        }
        else {
            $("#member").empty();
            loadteamleader();
            addtaskmember();
        }
    });
    /*Load expense case  user by case id*/
    $("#ddlExpenceCase").change(function () {
        var clientds = $("#ddlExpenceCase").val();
        if (clientds != "") {
            loadCaseUser(clientds, "#ddlExpenceTeamMember");
        }
        else {
            $("#ddlExpenceTeamMember").empty();
            loadteamleader();
        }
    });
    /*Load matter by client id*/
    $("#contact").change(function () {
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds, "matter");
        }
        else {
            $('#matter').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        }
    });
    $("#econtact").change(function () {
        var clientds = $(this).val();
        if (clientds != "") {
            loadmatter(clientds, "ematter");
        }
        else {
            $('#ematter').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        }
    });
    /*Common contact type*/
    $("#commoncontacttype").change(function () {
        var thisvalue = $("#commoncontacttype option:selected").text();
        if (thisvalue == "Others") { //others
            $("#myModalcontacttype").modal();
            LoadCustomsContactType();
        }
        else if (thisvalue == "Client") { //client
            $("#commoncontactloginpanel").css("display", "table");
            $("#commonothercontact").css("display", "none");
            $("#commanattachmentcontact").css("display", "none");
        }
        else if (thisvalue == "Prospect") { //prospect
            $("#commoncontactloginpanel").css("display", "none");
            $("#commonothercontact").css("display", "none");
            $("#commanattachmentcontact").css("display", "table");
        }
        else { //vendor
            $("#commonothercontact").css("display", "none");
            $("#commoncontactloginpanel").css("display", "none");
            $("#commanattachmentcontact").css("display", "none");
        }
    });
    $("#commancompanyname").change(function () {
        var thisvaluec = $("#commancompanyname").val();
        if (thisvaluec == "Others") {
            $("#commonothercompany").css("display", "table-row");
            $("#commancompanyname").css("display", "none");
        }
        else {
            $("#commonothercompany").css("display", "none");
        }
    });
    $("#casemoreoption3").click(function () {
        morepageno = morepageno + 1;
        var clientids = $("#commuclienthide").val();
        var ComapnyIds = $("#commucompanyidsnamethide").val();
        loadmatter3(morepageno, clientids, ComapnyIds);
    });
    $("#casemoreoption4").click(function () {
        morepageno1 = morepageno1 + 1;
        var clientidsss = $("#timecontactvalue").val();
        var ComapnyIdsss = $("#timecontactcomapnyvalue").val();
        loadmatter4(morepageno1, clientidsss, ComapnyIdsss);
    });
    $("#casemoreoption5").click(function () {
        morepageno2 = morepageno2 + 1;
        var clientidss = $("#clientnameid").val();
        var ComapnyIdss = $("#comapnyidsstask").val();
        loadmatter5(morepageno2, clientidss, ComapnyIdss);
    });
    //load matter
    //if (ChkControllers.toLowerCase() == "personaldashboard") {
    //    loadmatter_defalut(morepageno);
    //}

    $('#timecontact').on('input', function () {
        var value = $(this).val();
        if (value.trim() === '') {
            $(this).typeahead('val', '');
            $('.typeahead').typeahead('close');
            loadmatter_defalut(1);
        }
    });
    function loadmatter_defalut(pagenumber) {

        $('#sidebindcommucase,#timematter,#matter').empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
        var formData = new FormData();
        formData.append("Pageno", pagenumber);
        $.ajax({
            async: true,
            url: "/api/callApi/LoadAllMatterByFirmId",
            type: "POST",
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                $.each(response.Data, function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (response.Data.length == a.totRow) {
                        $("#casemoreoptiondiv1").hide();
                        $("#casemoreoptiondiv4").hide();
                        $("#casemoreoptiondiv5").hide();
                    } else {
                        if (a.totRow > 500) {
                            $("#casemoreoptiondiv1").show();
                            $("#casemoreoptiondiv4").show();
                            $("#casemoreoptiondiv5").show();
                        }
                        else {
                            $("#casemoreoptiondiv1").hide();
                            $("#casemoreoptiondiv4").hide();
                            $("#casemoreoptiondiv5").hide();
                        }
                    }
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $('#sidebindcommucase,#timematter,#matter').append(option);
                    }
                });
                closeload();
            },
            failure: function (response) {
                alert(data.responseText);
                closeload();
            },
            error: function (response) {
                alert(data.responseText);
                closeload();
            }
        });
    }
    /*Load matter by client id and matter type*/
    function loadmatter(clientid, mtypes) {
        if (mtypes != "") {
            $('#' + mtypes).empty().append('<option value="">Select Matter</option>').find('option:first').attr("selected", "selected");
            getcasebyajax(clientid, mtypes);
        }
    }
    function getcasebyajax(clientid, matteridslbl) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/callApi/LoadMatterforclient",
            headers: {
                "clientid": clientid
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    //alert("not found");
                }
                $.each(JSON.parse(response.Data), function (i, a) {
                    var mattername = a.mname;
                    var mid = a.Id;
                    if (mattername == null) {
                        mattername = "";
                        mid = "";
                    }
                    else {
                        var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        $("#" + matteridslbl).append(option);
                    }
                });
            },
            failure: function (response) {
                //alert(response.responseText);
            },
            error: function (response) {
                //alert(response.responseText);
            }
        });
    }
    //load all client
    //function loadallclient() {
    //    $.ajax({
    //        async: true,
    //        type: "POST",
    //        url: '/api/CallApi/SpClientDataNew',
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json",
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //                var obj = JSON.parse(response.Data);
    //            }
    //            else {
    //                //  alert("not found");
    //            }
    //            $("#filterclient option,#ifilterclient option,#ofilterclient option,#dfilterclient option,#afilterclient option,#filterclientexpense option,#txtnoticethrough option,#txtrejoinderthrough option,#txtreplythrough option, #multipleAddressClient option #multipleAddressClientFilter option #SelectCompany option").remove();
    //            $("#ofilterclient,#ifilterclient,#dfilterclient,#filterclient,#afilterclient,#filterclientexpense,#txtnoticethrough,#txtrejoinderthrough,#txtreplythrough,#SelectCompany").append("<option value=''>Client</option>");
    //            $("#multipleAddressClient,#multipleAddressClientFilter").append("<option value=''>Select</option>");
    //            $.each(obj, function (i, a) {
    //                var option = '<option value="' + a.val + '">' + a.label + '</option>';
    //                $("#filterclient,#ifilterclient,#ofilterclient,#dfilterclient,#afilterclient,#filterclientexpense,#txtnoticethrough,#txtrejoinderthrough,#txtreplythrough,#multipleAddressClient,#multipleAddressClientFilter").append(option);
    //                if (String(a.utype) == "Çompany") {
    //                    var option1 = '<option value="' + a.CompanyID + '">' + a.label + '</option>';
    //                    $("#SelectCompany").append(option1);
    //                }
    //            });
    //        },
    //        failure: function (response) {
    //            //alert(response.responseText);
    //        },
    //        error: function (response) {
    //            //alert(response.responseText);
    //        }
    //    });
    //}
    //loadcontact1();
    // load contact
    function loadcontact1() {
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/CallApi/SpClientDataNew',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //  alert("not found");
                }
                $("#contact2 option,#econtact option,#casefilterclient option,#timecontact option,#filterclient option,#ifilterclient option,#ofilterclient option,#ofilterclient option,#dfilterclient option,#afilterclient option,#filterclientexpense option,#multipleAddressClient option #multipleAddressClientFilter option #SelectCompany option").remove();
                $("#contact2,#econtact,#timecontact,#filterclient,#ifilterclient,#ofilterclient,#dfilterclient,#afilterclient,#multipleAddressClientFilter,#multipleAddressClient").append("<option value=''>Select</option>");
                $("#filterclientexpense").append("<option value=''>Client Name</option>");
                $("#casefilterclient").append("<option value=''>Select Client</option>");
                $.each(obj, function (i, a) {
                    var option = '<option value="' + a.val + '" >' + a.label + ' </option>';
                    $("#contact2,#econtact,#casefilterclient,#timecontact,#filterclient,#ifilterclient,#ofilterclient,#dfilterclient,#afilterclient,#filterclientexpense,#multipleAddressClientFilter,#multipleAddressClient").append(option);
                    $("#sidebindcommuclient,#sidebindcaseclient,#ddlExpenceClient,#client,#searchname,#clientids").append(option);
                    if (String(a.utype) == "Çompany") {
                        var option1 = '<option value="' + a.CompanyID + '">' + a.label + '</option>';
                        $("#SelectCompany").append(option1);
                    }
                });
            },
            failure: function (response) {
                //alert(response.responseText);
            },
            error: function (response) {
                //alert(response.responseText);
            }
        });
    }
    /*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    /*Bind task type*/
    function bindTaskType() {
        $("#tasktype,#etasktype").find('option').remove().end().append('<option value="">Select</option>');
        $("#filtertask,#ifiltertask,#ofiltertask,#dfiltertask,#ofiltertaskarchive").find('option').remove().end().append('<option value="">Task Type</option>');
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/DefaultCaseTaskList",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $.each(response.Data, function (i, a) {
                    var option = '<option value="' + a["Id"] + '" >  ' + a["CaseTaskName"] + '</option>';
                    $("#tasktype,#etasktype").append(option);
                    $("#filtertask,#ifiltertask,#ofiltertask,#dfiltertask,#ofiltertaskarchive").append(option);
                }); //End of foreach Loop
                if (userrolesids == "1") {
                    var optiont1 = '<option value="Others" style="font-weight:bold;color:#069;font-size:11px;">ADD NEW TASK TYPE</option>';
                    $("#tasktype").append(optiont1);
                }
            }, //End of AJAX Success function
            failure: function (response) {
                // alert(response.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                // alert(response.responseText);
            } //End of AJAX error function
        });
    }
    /*Bind task*/
    function bindTask() {
        $("#item,#item2").find('option').remove().end().append('<option value="">Select</option>');
        $("#filtertask,#ifiltertask,#ofiltertask,#dfiltertask,#ofiltertaskarchive").find('option').remove().end().append('<option value="">Task Type</option>');
        var formData = new FormData();
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomAndDefaultTask",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $.each(response.Data, function (i, a) {
                    // alert(a.Id);
                    var option = '<option value="' + a["Id"] + '" >  ' + a["CaseTaskName"] + '</option>';
                    $("#item,#item2").append(option);
                }); //End of foreach Loop
                if (userrolesids == "1") {
                    var optiont = '<option value="Others" style="font-weight:bold;color:#069;font-size:11px;">ADD NEW TASK</option>';
                    $("#item").append(optiont);
                }
            }, //End of AJAX Success function
            failure: function (response) {
            }, //End of AJAX failure function
            error: function (response) {
            } //End of AJAX error function
        });
    }
    /*Reset selected column*/
    function resetselectcommu() {
        $("#sidebindcommuclient").prop("selectedIndex", 0);
        $("#sidebindcommusubject").val('');
        $("#taskdetailscommu").val('');
        $("#inftypecommu").prop("selectedIndex", 0);
        $("#lblTeammemberSelect1").text("Select");
        $("#commuattachtitle").attr("title", "upload Attachment");
        $('#CommfileList').html("");
    }
    /*Reset selected task*/
    function resetselecttask() {
        $("#contact").prop("selectedIndex", 0);
        $("#tasktype").prop("selectedIndex", 0);
        $("#member").prop("selectedIndex", 0);
        $("#lblTeammemberSelect").text("Select");
        $("#taskattachtitle").attr("title", "upload Attachment");
    }
    /*Reset select contact*/
    function resetselectcontact() {
        $("#commoncontacttype").find('option:selected').removeAttr("selected");
        $("#commancompanyname").find('option:selected').removeAttr("selected");
        $("#commoncontacttype").prop("selectedIndex", 0);
        $("#commancompanyname").prop("selectedIndex", 0);
        $("#savecontactform")[0].reset();
        $("#commonothercontact").css("display", "none");
        $("#commoncontactloginpanel").css("display", "none");
        $("#commonothercompany").css("display", "none");
        $("#commonothercontact").css("display", "none");
        $("#commoncontacttype").css("display", "table-row");
        $("#commonothercompany").css("display", "none");
        $("#commancompanyname").css("display", "block");
    }
    /*Reset select case*/
    function resetselectcase() {
        $("#casecasetype").prop("selectedIndex", 0);
        $("#caseteamlead").prop("selectedIndex", 0);
        $("#savecaseform")[0].reset();
        $("#shortcasemap").val("");
        $("#checkclient").val("");
        $("#commoncaseloginpanel").hide();
        $("#casesideuserid").val("");
        $("#casesidepassword").val("");
        $("#casesidecpassword").val("");
        $("#caseclientcontact").find('option').remove().end().append('<option value="">Select</option>');
        var today = new Date().toISOString().split('T')[0];
        $("#codate").val(today);
        $("#clientdivcommon4").css("display", "none");
        $("#clientdivcommon1").css("display", "none");
        $("#clientdivcommon2").css("display", "none");
        $("#clientdivcommon3").css("display", "none");
        $("#tracksearchcase").hide();
        addtaskmember3();
    }
    //$("#newtaskdocs").change(function () {
    //    var fileCount = this.files.length;
    //    if (fileCount > 0) {
    //        $("#taskattachtitle").attr("title", "Document Attached");
    //    }
    //    else {
    //        $("#taskattachtitle").attr("title", "upload Attachment");
    //    }
    //});
    $('#newtaskdocs').on('change', function (e) {
        const files = Array.from(e.target.files || []);
        if (files.length) selectedLocalFiles.push(...files);

        renderAllFiles();

        // allow selecting same file again
        this.value = '';
    });

    $(document).on('click', '.remove-local', function () {
        const index = Number($(this).data('index'));
        selectedLocalFiles.splice(index, 1);
        renderAllFiles();
    });

    $(document).on('click', '.remove-server', function () {
        const index = Number($(this).data('index'));
        const removed = selectedServerFiles.splice(index, 1)[0];
        renderAllFiles();

        // ✅ If you need to also remove it on backend, call your API here:
        // if (removed?.id) deleteServerFile(removed.id);
    });

    $(document).on('click', '.remove-local-Comm', function () {
        const index = Number($(this).data('index'));
        selectedLocalFilesComm.splice(index, 1);
        renderAllFilesComm();
    });

    $(document).on('click', '.remove-server-Comm', function () {
        const index = Number($(this).data('index'));
        const removed = selectedServerFilesComm.splice(index, 1)[0];
        renderAllFilesComm();

        // ✅ If you need to also remove it on backend, call your API here:
        // if (removed?.id) deleteServerFile(removed.id);
    });
    //$(document).on('click', '.remove-file-add-task', function () {
    //    const index = Number($(this).data('index'));
    //    //const index = $(this).data('index');
    //    selectedFiles.splice(index, 1);
    //    //const fileList = $('#fileList');
    //    //fileList.empty();
    //    displayExistingAddTask();
    //});
    function displayFiles() {
        const fileList = $('#fileList');
        fileList.empty();
        const fCount = selectedFiles.length;
        selectedFiles.slice(0, 5).forEach((file, index) => {
            const fileItem = $(`
            <div class="file-item">
                <span class="file-name">${file.name}</span>
                <span class="remove-file" data-index="${index}" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
            fileList.append(fileItem);
        });
        if (fCount > 5) {
            const remaining = fCount - 5;
            fileList.append(`
            <div class="file-summary" style="margin-top:px;color:#555;">
                +${remaining} more (Total ${fCount} files selected)
            </div>
        `);
        }
        updateFileInput();
    }
    /*Atttachment*/
    //$('#attachmentcommu').on('change', function (e) {
    //    selectedFilesComm = [];
    //    var fileCount = this.files.length;
    //    if (fileCount > 0) {
    //        $("#attachmentcommu").attr("title", "Document Attached");
    //    }
    //    else {
    //        $("#attachmentcommu").attr("title", "upload Attachment");
    //    }

    //    const files = Array.from(e.target.files);
    //    selectedFilesComm = [...selectedFilesComm, ...files];
    //    displayFiles();
    //    this.value = '';
    //});

    //$(document).on('click', '.remove-file-comm', function () {
    //    const index = $(this).data('index');
    //    selectedFilesComm.splice(index, 1);
    //    displayFilesComm();
    //});
    //$(document).on('click', '.remove-file-add-comm', function () {
    //    const index = $(this).data('index');
    //    selectedFilesComm.splice(index, 1);
    //    displayExistingAddCommunication();
    //});
    //function displayFilesComm() {
    //    const fileList = $('#CommfileList');
    //    //fileList.empty();
    //    const fCount = selectedFilesComm.length;
    //    selectedFilesComm.slice(0, 5).forEach((file, index) => {
    //        const fileItem = $(`
    //        <div class="file-item">
    //            <span class="file-name">${file.name}</span>
    //            <span class="remove-file-comm" data-index="${index}" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
    //        </div>
    //    `);
    //        fileList.append(fileItem);
    //    });
    //    if (fCount > 5) {
    //        const remaining = fCount - 5;
    //        fileList.append(`
    //        <div class="file-summary" style="margin-top:5px;color:#555;">
    //            +${remaining} more (Total ${fCount} files selected)
    //        </div>
    //    `);
    //    }
    //    updateFileInputComm();
    //}

    $("#attachmentcommu").change(function (e) {
        const files = Array.from(e.target.files || []);
        if (files.length) selectedLocalFilesComm.push(...files);

        renderAllFilesComm();

        // allow selecting same file again
        this.value = '';
    });

    $("#timeattachtitle").change(function () {
        var fileCount = this.files.length;
        if (fileCount > 0) {
            $("#postedfile").attr("title", "Document Attached");
        }
        else {
            $("#postedfile").attr("title", "upload Attachment");
        }
    });
    
    $(document).on("change", "#postedFile", function () {
        const file = this.files && this.files[0];

        if (file) {
            $("#fileName").text(file.name);
            $("#fileChip").css("display", "inline-flex");   
        } else {
            $("#fileName").text("");
            $("#fileChip").hide();
        }
    });

    $(document).on("click", "#deleteFile", function () {
        $("#postedFile").val("");
        $("#fileName").text("");
        $("#fileChip").hide();
    });


    /*Save case task details*/
    $("#SaveCaseTask").click(function () {
        var formData = new FormData();
        var caseid = $("#matter").val();
        var tasktype = $("#tasktype").val();
        // var member = $("#addtaskmember").val();
        var actionbydate = $("#actionbydate").val();
        var taskduedate = $("#taskduedate").val();
        var taskdetails = $("#taskdetails").val();
        var client = $("#taskcontact").val();
        var clientids = $("#clientnameid").val();
        var tasksubject = $("#tasksubject").val();
        var val = [];
        //var membersids = "";
        //$('.taskmembercls:checkbox:checked').each(function (i) {
        //    val[i] = $(this).val();
        //    membersids += val[i] + ",";
        //});
        var membersids = $("#addtaskmember_new").val();
        if (tasktype == "") {
            alert("Please select the type of task you would like to add in the matter.");
            document.getElementById("tasktype").focus();
            return false;
        }
        if (tasktype == "Others") {
            alert("Please select the type of task you would like to add in the matter.");
            document.getElementById("tasktype").focus();
            return false;
        }
        if (membersids == "" || membersids == null || membersids == undefined) {
            alert("Please assign the task to a particular team member.");
            document.getElementById("member").focus();
            return false;
        }
        if (taskduedate == "") {
            alert("Please select a due date for the task, on or before which the task needs to be completed.");
            document.getElementById("taskduedate").focus();
            return false;
        }
        if (actionbydate == "") {
            alert("Please select the date by when the team member can accept or reject the task.");
            document.getElementById("actionbydate").focus();
            return false;
        }
        if (taskduedate != "" && actionbydate != "") {
            var date1 = new Date(taskduedate);
            var date2 = new Date(actionbydate);
            if (date2 > date1) {
                alert("Due date should not be less than Accept/Reject By date");
                return false;
            }
        }
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = selectedLocalFiles.length;//document.getElementById("newtaskdocs").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = selectedLocalFiles[i];//document.getElementById("newtaskdocs").files[i];
            var filename = file.name;
            //validate filechracter
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
                //alert(err.message);
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
        formData.append("caseid", EncodeText(caseid));
        formData.append("tasksubject", EncodeText(tasksubject));
        formData.append("assignuser", EncodeText(membersids));
        formData.append("tasktype", EncodeText(tasktype));
        formData.append("duedate", EncodeText(taskduedate));
        formData.append("actionbydate", EncodeText(actionbydate));
        formData.append("details", EncodeText(taskdetails));
        formData.append("client", EncodeText(clientids));
        formData.append("savemykasefileid", EncodeText($("#mykasefileidtask").val()));
        openload();
        //read assign using list
        $("#SaveCaseTask").prop('disabled', true);
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/SaveCaseTask",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (parseInt(response.Data.Result) > 0) {
                    var InfectFilesResult = "";
                    if (response.Data.InfectFiles != "") {
                        InfectFilesResult = VirusScanResultMsgBefore + " " + response.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                    }
                    new PNotify({
                        title: 'Success!',
                        text: 'The task has been assigned successfully</br>' + InfectFilesResult,
                        type: 'success',
                        delay: 3000
                    });
                    $('#savetaskform')[0].reset();
                    $("#mykasefileidtask").val("");
                    $("#browsefiletask").attr("title", "No file chosen");
                    $("#browsefilelbltask").html("No file chosen");
                    $("#tasktype").val("");
                    $("#addtaskmember").val("");
                    $("#tasksubject").val('');
                    $("#taskduedate").val('');
                    $("#actionbydate").val('');
                    $("#taskdetails").val('');
                    $('#fileList').html("");
                    try {
                        loadteamleader();
                        localStorage.setItem("Checkcommansidetask", "true");
                        LoadTaskData(pageindex);
                        iLoadTaskData(ipageindex);
                        oLoadTaskData(opageindex);
                        loadInoutCount();
                        dLoadTaskData(dpageindex);
                    }
                    catch (er) {
                    }
                    closeload();
                    $("#lblTeammemberSelect").text("Select");
                    $("#SaveCaseTask").prop('disabled', false);
                }
                else if (String(response.Data.Result) == "EXCEEDLIMIT") {
                    alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                    $("#SaveCaseTask").prop('disabled', false);
                    closeload();
                }
                else if (String(response.Data.Result) == "NOLIMIT") {
                    alert("Please Upgrade Your Storage Limit");
                    $("#SaveCaseTask").prop('disabled', false);
                    closeload();
                }
                else if (String(response.Data.Result) == "false") {
                    alert("The file (s) you are trying upload seems corrupt or contain some malicious content. Please check the file and try to upload again.");
                    $("#SaveCaseTask").prop('disabled', false);
                    closeload();
                }
                else if (response.Data.Result == "-1") {
                    alert("Task related to this matter has already been assigned to this team member.");
                    $("#SaveCaseTask").prop('disabled', false);
                    closeload();
                }
                else {
                    alert("The file (s) you are trying upload seems corrupt or contain some malicious content. Please check the file and try to upload again.");
                    console.log("task: " + response.Data);
                    $("#SaveCaseTask").prop('disabled', false);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                $("#SaveCaseTask").prop('disabled', false);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                $("#SaveCaseTask").prop('disabled', false);
                closeload();
            } //End of AJAX error function
        });
    });
    //Reset Task Common form
    $("#taskresetform").click(function () {
        $('#savetaskform')[0].reset();
        $('#fileList').html("");
    });
    $("#SaveCommu").click(function () {
        var val = [];
        var membersids = "";
        //$('.taskmembercls1:checkbox:checked').each(function (i) {
        //    val[i] = $(this).val();
        //    membersids += val[i] + ",";
        //});
        var member = $("#alertmember").val();
        var formData = new FormData();
        var caseid = $("#sidebindcommucase").val();
        //var inftype = $("#inftypecommu").val();
        var inftype = "";
        var Subject = $('#sidebindcommusubject').val();
        //var member = membersids.replace(/,/g, "");
        var details = $("#taskdetailscommu").val();
        if (caseid == "") {
            alert("Please select the matter you wish to add.");
            document.getElementById("sidebindcommucase").focus();
            return false;
        }
        if (member == "" || member == null) {
            alert("Select team member");
            document.getElementById("alertmember").focus();
            return false;
        }
        if (Subject == "") {
            alert("Please enter the Subject name.");
            document.getElementById("sidebindcommusubject").focus();
            return false;
        }
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = selectedLocalFilesComm.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = selectedLocalFilesComm[i];
            var filename = file.name;
            //validate filechracter
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
                //alert(err.message);
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
        if (tottempsize > parseFloat(TOTALLIMIT)) {
            alert(TOTALLIMITMSG);
            return false;
        }
        const serverIds = selectedServerFilesComm.map(x => x.id);
        formData.append("caseid", EncodeText(caseid));
        formData.append("member", EncodeText(member));
        formData.append("inftype", EncodeText(inftype));
        formData.append("details", EncodeText(details));
        formData.append("subject", EncodeText(Subject));
        formData.append("savemykasefileid", EncodeText(serverIds.join(",")));
        //read assign using list
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/SaveCaseCommunique",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Data.Result == "") {
                    localStorage.setItem("savecommunication", "data");
                    var InfectFilesResult = "";
                    if (response.Data.InfectFiles != "") {
                        InfectFilesResult = VirusScanResultMsgBefore + " " + response.Data.InfectFiles + " " + VirusScanResultMsgAfter;
                    }
                    new PNotify({
                        title: 'Success!',
                        text: 'Your message is sent to the desired recipient successfully.</br>' + InfectFilesResult,
                        type: 'success',
                        delay: 3000
                    });
                    $("#mykasefileidcommunique").val("");
                    $("#browsefilecommunique").attr("title", "No file chosen");
                    $("#browsefilelblcommunique").html("No file chosen");
                    resetselectcommu();
                    closeload();
                }
                else if (String(response.Data.Result) == "EXCEEDLIMIT") {
                    alert("Your Storage limit exceeded. Please Upgrade Your Storage Limit.");
                    closeload();
                    return false;
                }
                else if (String(response.Data.Result) == "NOLIMIT") {
                    alert("Please Upgrade Your Storage Limit");
                    closeload();
                    return false;
                }
                else {
                    alert(response.Data);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                closeload();
            } //End of AJAX error function
        });
    });
    //Reset Task Common form
    $("#idresetcommon").click(function () {
        $('#savetaskcommu')[0].reset();
    });

    var isvaid = false;
    $('#switchtomatter').click(function () {
        if ($(this).is(':checked')) {
            $("#SaveContact").click();
        }
    });

    /*Save contact*/
    $("#SaveContact").click(function () {
        $("#switchtomatter").attr('checked', false);
        var formData = new FormData();
        var fname = $("#sidefname").val();
        var lname = $("#sidelname").val();
        var designation = $("#sidedesignation").val();
        var ocontacttype = $("#sidecontacttype").val();
        var contacttype = $("#commoncontacttype").val();
        var companyname = $("#commancompanyname").val();
        var ocompanyname = $("#sideothercompanyname").val();
        var mobile = $("#sideMPhone").val();
        var landline = $("#sideLPhone").val();
        var Email = $("#sideEmail").val();
        var landline = $("#sideLPhone").val();
        var userid = null;
        var password = null;
        var confirmPassword = null;
        var note = $("#contactnote").val();
        var contacttypetext = $("#commoncontacttype option:selected").text();
        var contcatflag = 0;
        if (fname == "") {
            alert("Please enter the first name of the client you wish to add.");
            document.getElementById("sidefname").focus();
            return false;
        }
        if (contacttype == "") {
            alert("Please select from the list the type of contact you wish to add.");
            document.getElementById("commoncontacttype").focus();
            return false;
        }
        if (contacttypetext == "Others") {
            if (ocontacttype == "") {
                alert("Please specify the type of contact you wish to add.");
                document.getElementById("sidecontacttype").focus();
                return false;
            }
            else {
                if (ocontacttype.toUpperCase() == "OTHERS" || ocontacttype.toUpperCase() == "PROSPECT" || ocontacttype.toUpperCase() == "VENDOR" || ocontacttype.toUpperCase() == "CLIENT") {
                    alert("The contact type you are trying to add already exists.");
                    document.getElementById("sidecontacttype").focus();
                    return false;
                }
            }
            contacttype = ocontacttype;
            contcatflag = 1;
        }
        else {
        }
        if (companyname == "Others") {
            if (ocompanyname == "") {
                alert("Please enter the company name you wish to add");
                document.getElementById("sideothercompanyname").focus();
                return false;
            }
            else {
                if (ocompanyname.toUpperCase() == "OTHERS") {
                    alert("Company name that you are trying to add already exists. Please specify a different name.");
                    document.getElementById("sideothercompanyname").focus();
                    return false;
                }
            }
            companyname = ocompanyname;
        }
        var istypes = $("input[name='shortselectusertype']:checked").val();
        if (istypes == "company") {
            if (companyname == "" && ocompanyname == "") {
                alert("Please select the company name");
                document.getElementById("commancompanyname").focus();
                return false;
            }
        }
        if (mobile == "") {
            alert("Please enter a mobile number");
            document.getElementById("sideMPhone").focus();
            return false;
        }
        if (mobile.length < 10) {
            alert("Please enter a valid mobile no. with 10 digits only.");
            document.getElementById("sideMPhone").focus();
            return false;
        }
        if (landline != "") {
            if (landline.length < 10) {
                alert("Please enter a valid landline no. with 10 digits only.");
                document.getElementById("sideLPhone").focus();
                return false;
            }
        }
        if (Email != "") {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(Email) == false) {
                alert('Please enter a valid E-mail Id.');
                document.getElementById("sideEmail").focus();
                return false;
            }
        }
        var tempsize = 0;
        var tottempsize = 0;
        var totalFiles = document.getElementById("attachmentcontact").files.length;
        for (var i = 0; i < totalFiles; i++) {
            var file = document.getElementById("attachmentcontact").files[i];
            var filename = file.name;
            //validate filechracter
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
                //alert(err.message);
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
        if (tottempsize > parseFloat(TOTALLIMIT)) {
            alert(TOTALLIMITMSG);
            return false;
        }
        openload();
        formData.append("istypes", EncodeText(istypes));
        formData.append("fname", EncodeText(fname));
        formData.append("lname", EncodeText(lname));
        formData.append("designation", EncodeText(designation));
        formData.append("contacttype", EncodeText(contacttype));
        formData.append("ocontacttype", EncodeText(ocontacttype));
        formData.append("companyname", EncodeText(companyname));
        formData.append("mobile", EncodeText(mobile));
        formData.append("landline", EncodeText(landline));
        formData.append("Email", EncodeText(Email));
        formData.append("userid", EncodeText(userid));
        formData.append("confirmPassword", EncodeText(confirmPassword));
        formData.append("contcatflag", EncodeText(contcatflag));
        formData.append("note", EncodeText(note));
        $("#switchtomatter").attr('checked', true);
        isvaid = true;
        //read assign using list
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/SaveContactsCommon",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (parseInt(response.Data) > 0) {
                    alert("Contact has been created successfully.");
                    resetselectcontact();
                    closeload();
                    if (isvaid == true) {
                        $("#homelinkcase").click();
                        $("#switchtomatter").attr('checked', false);
                        isvaid = false;
                    }
                    localStorage.setItem("shortcontact", "1");
                    setTimeout(function () {
                        loadContacttype();
                        loadCompany();
                    }, 3000);
                }
                else if (response.Data == "Already Exists Mobile Please Try Another Mobile!") {
                    alert("The mobile number you have entered already exists. Please enter a different number.");
                    closeload();
                }
                else if (response.Data == "Email id is already exists. Please try with different Id!") {
                    alert("The E-mail Id you have entered already exists, please try a different e-mail id.");
                    closeload();
                }
                else {
                    alert(response.Data);
                    closeload();
                }
            }, //End of AJAX Success function
            failure: function (response) {
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                closeload();
            } //End of AJAX error function
        });
    });
    //Reset Contact Common form
    $("#ClearCustomSelection").click(function () {
        $('#savecontactform')[0].reset();
    });
    $('#switchtocontact').click(function () {
        $("#homelinkcontact").click();
        $("#switchtocontactexist").click();
    });
    var usertype1 = "";

    /*Get data by user type*/
    $(document).on("change", "#selectusertype", function () {
        usertype1 = $('#selectusertype').val();
        if (usertype1 == "company") {
            $("#clientcontactdiv").show();
            $("#clientdivcommon1").css("display", "block");
            $("#clientdivcommon2").css("display", "block");
            $("#clientdivcommon3").css("display", "block");
        }
        else if (usertype1 == "user") {
            $("#clientcontactdiv").hide();
            $("#clientdivcommon1").css("display", "block");
            $("#clientdivcommon2").css("display", "block");
            $("#clientdivcommon3").css("display", "block");
        }
        else {
            $("#clientdivcommon1").css("display", "none");
            $("#clientdivcommon2").css("display", "none");
            $("#clientdivcommon3").css("display", "none");
        }
    });

    /*Save common cases*/
    $("#savecasecommon").click(function () {
        var formData = new FormData();
        //  usertype1 = $('#selectusertype').val();
        usertype1 = $("#Icompanyorindi").val();
        var clientname = $("#shortcasemap").val();
        var newcompanyid = $("#companyid").val();
        var casename = $("#sideCasename").val();
        //var caseno = $("#sideCaseno").val();
        var caseno = "";
        var casecasetype = $("#casecasetype").val();
        //var teamlead = $("#caseteamlead").val();
        var teamlead = "";
        var details = $("#taskdetailscase").val();
        var clientcontact = $("#caseclientcontact").val();
        var userid = "";
        var password = "";
        var confirmPassword = "";
        var checkclient = $("#checkclient").val();
        var opendate = $("#codate").val();
        if (casename == "") {
            alert("Please enter the matter name.");
            document.getElementById("sideCasename").focus();
            return false;
        }
        var reg = /[:*?"<>|$%#!~+*^]/;
        if (reg.test(casename) == true) {
            alert('[:*?"<>|$%#!~+*^] are not allowed in Matter name.');
            document.getElementById("sideCasename").focus();
            return false;
        }
        casename = String(casename).replace(/[:*?"<>|$%#!~+*^]/g, '');
        casename = $.trim(casename);
        //if (usertype1 != "") {
        //    if (clientname == "") {
        //        alert("Please select the client name associated with the matter");
        //        document.getElementById("sidebindcaseclient").focus();
        //        return false;
        //    }
        //}
        if (casecasetype == "") {
            alert("Please select the matter type.");
            document.getElementById("casecasetype").focus();
            return false;
        }
        var tempsize = 0;
        var tottempsize = 0;
        //var totalFiles = document.getElementById("attachmentcase").files.length;
        //for (var i = 0; i < totalFiles; i++) {
        //    var file = document.getElementById("attachmentcase").files[i];
        //    var filename = file.name;
        //    //validate filechracter
        //    var fileNameIndex = filename.lastIndexOf("/") + 1;
        //    var dotIndex = filename.lastIndexOf('.');
        //    var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
        //    var reg = /[@\\/:*?"<>|.&$%#!~+`*^,]/;
        //    if (reg.test(newfioename) == true) {
        //        alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
        //        return false;
        //    }
        //    if (filename.length > 100) {
        //        alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
        //        return false;
        //    }
        //    var Extresponse = checkfileext(filename);
        //    if (String(Extresponse) == "false") {
        //        return false;
        //    }
        //    formData.append("FileUpload", file);
        //    try {
        //        if (typeof (file) != "undefined") {
        //            size = parseFloat(file.size / 1024).toFixed(2);
        //            tottempsize = parseFloat(tottempsize) + parseFloat(size);
        //            tempsize = parseFloat(size);
        //        }
        //    }
        //    catch (err) {
        //        //alert(err.message);
        //    }
        //    tempsize = tempsize.toFixed(2);
        //    if (tempsize > filesize) {
        //        new PNotify({
        //            title: 'Warning!',
        //            text: Filesizelabel,
        //            type: 'error',
        //            delay: 3000
        //        });
        //        return false
        //    }
        //}
        //if (tottempsize > parseFloat(TOTALLIMIT)) {
        //    alert(TOTALLIMITMSG);
        //    return false;
        //}
        var membersids = "";
        $('.taskmembercls:checkbox:checked').each(function (i) {
            val[i] = $(this).val();
            membersids += val[i] + ",";
        });
        var addtaskmember3 = $("#addtaskmember3").val();
        var comclient1 = $("#sidebindcaseclient").val();
        if (comclient1 != "") {
            if (usertype1 == "company") {
                if (clientcontact == "") {
                    alert("select client contact lead");
                    document.getElementById("caseclientcontact").focus();
                    return false;
                }
            }
        }
        formData.append("usertypes", EncodeText(usertype1));
        formData.append("clientname", EncodeText(clientname));
        formData.append("newcompanyid", EncodeText(newcompanyid));
        formData.append("casename", EncodeText(casename));
        formData.append("caseno", EncodeText(caseno));
        formData.append("casecasetype", EncodeText(casecasetype));
        formData.append("teamlead", EncodeText(teamlead));
        formData.append("details", EncodeText(details));
        formData.append("clientcontacts", EncodeText(clientcontact));
        formData.append("userid", EncodeText(userid));
        formData.append("confirmPassword", EncodeText(confirmPassword));
        formData.append("checkclient", EncodeText(checkclient));
        formData.append("odate", EncodeText(opendate));
        formData.append("assignuser", EncodeText(addtaskmember3));
        //read assign using list
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/MatterApi/ShortSaveCase",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (parseInt(response.Data) > 0) {
                    alert("Your matter has been created successfully.");
                    resetselectcase();
                    localStorage.setItem("shortcase", "1");
                    closeload();
                    var fcode5 = localStorage.getItem("FirmCode");
                    window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                }
                else if (response.Data == "Already exist matter name. please try another matter name") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Matter name already exists. Try another matter name.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
                else {
                    alert(response.Data);
                    closeload();
                }
                //  //console.log(response);
            }, //End of AJAX Success function
            failure: function (response) {
                //  alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                //alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });
    });

    //Reset Matter Commmon form
    $("#matrreset").click(function () {
        $('#savecaseform')[0].reset();
    });
    $("#newcommureset").click(function () {
        resetselectcommu();
    });
    $("#newtaskreset").click(function () {
        resetselecttask();
    });
    $("#newcontactreset").click(function () {
        resetselectcontact();
        $("#commancompanyname").css("display", "block");
    });
    $("#newcasereset").click(function () {
        resetselectcase();
    });
    $("#homelinktask").click(function () {
        var dashmatter = dashmatterss;
        if (dashmatter == "display:none") {
            $('#myLockedfeatureBillingModal').modal('show');
            $("#idlockedfeature").val("Task");
            // alert("You have not sunscribe this feature. Pls conatct to our team");
            return false;
        } else {
            $("#sideaddcontact").hide();
            $("#sideaddcase").hide();
            $("#sideaddcommu").hide();
            $("#sidelogtimer").hide();
            $("#sideliveupdate").hide();
            $("#sideaddhelp").hide();
            $("#sideaddhelp2").hide();
            $("#sideaddtools").hide();
            $("#sideaddhelp").hide();
            $("#sideaddhelp2").hide();
            $("#sideaddtools").hide();
            $("#homelinktask").addClass("active");
            $("#homelinkcontact").removeClass("active");
            $("#homelinktool").removeClass("active");
            $("#homelinkcase").removeClass("active");
            $("#homelinkcommu").removeClass("active");
            $("#homelinktimer").removeClass("active");
            $("#homelinkaddcasetocw").removeClass("active");
            $('#sideaddtask').toggle("slide", { direction: "right" }, 500);
        }
    });
    $("#homelinkcontact").click(function () {
        var dashmatter = dashmatterss;
        if (dashmatter == "display:none") {
            $("#idlockedfeature").val("Contact");
            $('#myLockedfeatureBillingModal').modal('show');
            //alert("You have not sunscribe this feature. Pls conatct to our team");
            return false;
        } else {
            $("#sideaddtask").hide();
            $("#sideaddcase").hide();
            $("#sideaddcommu").hide();
            $("#sidelogtimer").hide();
            $("#sideliveupdate").hide();
            $("#sideaddhelp").hide();
            $("#sideaddhelp2").hide();
            $("#sideaddtools").hide();
            $("#sideaddhelp").hide();
            $("#sideaddhelp2").hide();
            $("#sideaddtools").hide();
            $("#homelinkcontact").addClass("active");
            $("#homelinktool").removeClass("active");
            $("#homelinktask").removeClass("active");
            $("#homelinkcase").removeClass("active");
            $("#homelinkcommu").removeClass("active");
            $("#homelinktimer").removeClass("active");
            $("#homelinkaddcasetocw").removeClass("active");
            $('#sideaddcontact').toggle("slide", { direction: "right" }, 500);
        }
    });
    $("#homelinkcase").click(function () {
        var dashmatter = dashmatterss;
        if (dashmatter == "display:none") {
            $("#idlockedfeature").val("Matter");
            $('#myLockedfeatureBillingModal').modal('show');
            // alert("You have not sunscribe this feature. Pls conatct to our team");
            return false;
        } else {
            $("#sideaddtask").hide();
            $("#sideaddcontact").hide();
            $("#sideaddcommu").hide();
            $("#sidelogtimer").hide();
            $("#sideliveupdate").hide();
            $("#sideaddhelp").hide();
            $("#sideaddhelp2").hide();
            $("#sideaddtools").hide();
            $("#sideaddhelp").hide();
            $("#sideaddhelp2").hide();
            $("#sideaddtools").hide();
            $("#homelinkcase").addClass("active");
            $("#homelinktask").removeClass("active");
            $("#homelinktool").removeClass("active");
            $("#homelinkcontact").removeClass("active");
            $("#homelinkcommu").removeClass("active");
            $("#homelinktimer").removeClass("active");
            $("#homelinkaddcasetocw").removeClass("active");
            $('#sideaddcase').toggle("slide", { direction: "right" }, 500);
        }

    });
    $("#homelinktool").click(function () {
        var dashmatter = dashmatterss;
        if (dashmatter == "display:none") {
            $("#idlockedfeature").val("Tools");
            $('#myLockedfeatureBillingModal').modal('show');
            //  alert("You have not sunscribe this feature. Pls conatct to our team");
            return false;
        } else {
            $("#sideaddtask").hide();
            $("#sideaddcontact").hide();
            $("#sideaddcommu").hide();
            $("#sidelogtimer").hide();
            $("#sideliveupdate").hide();
            $("#sideaddhelp").hide();
            $("#sideaddhelp2").hide();
            $("#sideaddcase").hide();
            $("#homelinktool").toggleClass("active")
            $("#homelinkcase").removeClass("active");
            $("#homelinktask").removeClass("active");
            $("#homelinkcontact").removeClass("active");
            $("#homelinkcommu").removeClass("active");
            $("#homelinktimer").removeClass("active");
            $("#homelinkaddcasetocw").removeClass("active");
            $('#sideaddtools').toggle("slide", { direction: "right" }, 500);
        }
    });

    //For Side Case Tools Option
    $("#homelinktoolLT").click(function () {
        $("#sideliveupdate").hide();
        $("#sideaddhelp").hide();
        $("#sideaddhelp2").hide();
        $("#sideaddtools").hide();
        $("#homelinktoolLT").addClass("active")
        $("#homelinkcase").removeClass("active");
        $("#homelinktask").removeClass("active");
        $("#homelinkcontact").removeClass("active");
        $("#homelinkcommu").removeClass("active");
        $("#homelinktimer").removeClass("active");
        $("#homelinkaddcasetocw").removeClass("active");
        $('#sideaddtoolsForLT').toggle("slide", { direction: "right" }, 500);
    });
    $("#homehelp1").click(function () {
        $("#sideaddtask").hide();
        $("#sideaddcontact").hide();
        $("#sideaddcommu").hide();
        $("#sidelogtimer").hide();
        $("#sideliveupdate").hide();
        $("#sideaddtools").hide();
        $("#sideaddtoolsForLT").hide();
        $("#sideaddcase").hide();
        $("#homehelp1").addClass("active");
        $("#homelinktool").removeClass("active")
        $("#homelinkcase").removeClass("active");
        $("#homelinktask").removeClass("active");
        $("#homelinkcontact").removeClass("active");
        $("#homelinkcommu").removeClass("active");
        $("#homelinktimer").removeClass("active");
        $("#homelinkaddcasetocw").removeClass("active");
        $('#sideaddhelp').toggle("slide", { direction: "right" }, 500);
    });
    $("#homehelp2").click(function () {
        $("#sideaddtask").hide();
        $("#sideaddcontact").hide();
        $("#sideaddcommu").hide();
        $("#sidelogtimer").hide();
        $("#sideliveupdate").hide();
        $("#sideaddtools").hide();
        $("#sideaddtools").hide();
        $("#homehelp2").addClass("active");
        $("#homelinktool").removeClass("active")
        $("#homelinkcase").removeClass("active");
        $("#homelinktask").removeClass("active");
        $("#homelinkcontact").removeClass("active");
        $("#homelinkcommu").removeClass("active");
        $("#homelinktimer").removeClass("active");
        $("#homelinkaddcasetocw").removeClass("active");
        $("#sideaddcase").hide();
        $('#sideaddhelp2').toggle("slide", { direction: "right" }, 500);
    });
    $("#homelinkcommu").click(function () {
        var dashmatter = dashmatterss;
        if (dashmatter == "display:none") {
            $("#idlockedfeature").val("Communication");
            $('#myLockedfeatureBillingModal').modal('show');
            //alert("You have not sunscribe this feature. Pls conatct to our team");
            return false;
        } else {
            $("#sideaddtask").hide();
            $("#sideaddcase").hide();
            $("#sideaddcontact").hide();
            $("#sidelogtimer").hide();
            $("#sideliveupdate").hide();
            $("#sideaddhelp").hide();
            $("#sideaddhelp2").hide();
            $("#sideaddtools").hide();
            $("#sideaddhelp").hide();
            $("#sideaddhelp2").hide();
            $("#sideaddtools").hide();
            $("#homelinkcommu").addClass("active");
            $("#homelinktask").removeClass("active");
            $("#homelinkcontact").removeClass("active");
            $("#homelinkcase").removeClass("active");
            $("#homelinkconctact").removeClass("active");
            $("#homelinktimer").removeClass("active");
            $("#homelinkaddcasetocw").removeClass("active");
            $('#sideaddcommu').toggle("slide", { direction: "right" }, 500);
        }
    });
    $("#homelinktimer").click(function () {
        $("#sideaddtask").hide();
        $("#sideaddcase").hide();
        $("#sideaddcontact").hide();
        $("#sideaddcommu").hide();
        $("#sideliveupdate").hide();
        $("#sideaddhelp").hide();
        $("#sideaddhelp2").hide();
        $("#sideaddtools").hide();
        $("#sideaddhelp").hide();
        $("#sideaddhelp2").hide();
        $("#sideaddtools").hide();
        $("#homelinktimer").addClass("active");
        $("#homelinktask").removeClass("active");
        $("#homelinkcase").removeClass("active");
        $("#homelinkconctact").removeClass("active");
        $("#homelinkcommu").removeClass("active");
        $("#homelinkaddcasetocw").removeClass("active");
        $('#sidelogtimer').toggle("slide", { direction: "right" }, 500);
    });
    $("#homelinkaddcasetocw").click(function () {
        $("#sideaddtask").hide();
        $("#sideaddcase").hide();
        $("#sideaddcontact").hide();
        $("#sideaddcommu").hide();
        $("#sidelogtimer").hide();
        $("#sideaddhelp").hide();
        $("#sideaddhelp2").hide();
        $("#sideaddtools").hide();
        $("#sideaddhelp").hide();
        $("#sideaddhelp2").hide();
        $("#sideaddtools").hide();
        $("#homelinktimer").removeClass("active");
        $("#homelinktask").removeClass("active");
        $("#homelinkcase").removeClass("active");
        $("#homelinkconctact").removeClass("active");
        $("#homelinkcommu").removeClass("active");
        $("#homelinkaddcasetocw").addClass("active");
        $('#sideliveupdate').toggle("slide", { direction: "right" }, 500);
    });
    //For Chate link open
    //$("#chatlink").click(function () {
    //    $("#tab3").click();
    //    $("#chatmodalview1").show();
    //});
    /*Disable*/
    //$(document).on('click', '#lnkchatdisablenew', function () {
    //    if (sessionStorage.getItem("hidtempchatdisable") == "1") {
    //        sessionStorage.setItem("hidtempchatdisable", "null");
    //        $("#divChatReminder").show();
    //        $("#lnkchatdisablenew").text("Disable Chat Reminder");
    //    }
    //    else {
    //        sessionStorage.setItem("hidtempchatdisable", "1");
    //        $("#divChatReminder").hide();
    //        $("#lnkchatdisablenew").text("Enable Chat Reminder");
    //    }
    //});
    //$(document).on('click', '#lnkchatreminderjoin', function () {
    //    sessionStorage.setItem("hidtempchatdisable", "1");
    //    $("#divChatReminder").hide();
    //    $("#lnkchatdisablenew").text("Enable Chat Reminder");
    //});
    //$(document).on('click', '#reminderClose', function () {
    //    $("#chatmodalview1").hide();
    //});
    //save data
    $("#fcasecasetype,#fcasestatus").change(function () {
        if (userrolesids == "1") {
            var values = $(this).val();
            var tag = $('option:selected', this).attr('tag');
            var type = $('option:selected', this).attr('type');
            if (values == "Others") {
                if (type == "Case_Type") {
                    $("#fcasecasetype").val("");
                }
                else if (type == "Case_Status") {
                    $("#fcasestatus").val("");
                }
                $("#myModalCommonDropdown").modal();
                $("#Commondropdownhidden").val(tag);
                $("#Commondropdowntypehidden").val(type);
                $("#CommonDropdownh4").html(tag);
                $("#CommonDropdownNameLabel").html(tag + " Name");
                $("#txtNameCommonDropdown").attr("placeholder", "Enter " + tag);
                $("#CommonDropdownthText").html(tag + " Name");
                $("#CommonDropdownstatus").html("No " + tag + " found.");
                LoadCommonDropdownList();
            }
        }
    });
    /*Load common dropdown details*/
    function LoadCommonDropdownList() {
        var html = '';
        var tag = $("#Commondropdownhidden").val();
        var type = $("#Commondropdowntypehidden").val();
        $("#assignuserCommonDropdown").html("");
        var formData = new FormData();
        formData.append("type", EncodeText(type));
        //read assign using list
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomCommonDropdown",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                if (obj == null || obj == "") {
                    $("#CommonDropdownstatus").show();
                }
                else {
                    $("#CommonDropdownstatus").hide();
                }
                $.each(obj, function (i, a) {
                    qty1 = qty1 + 1;
                    html += '<tr><td class="CustomerId">' + qty1 + '</td><td class="Name"><span>' + a.Name + '</span> <input type="text" class="form-control" value="' + a.Name + '" style="display:none" /></td><td><a class="" href="javascript:;" style="display:none">Edit</a><a class="Update btn btn-info btn-mail" href="javascript:;" style="display:none">Update</a> <a class="Cancel btn btn-default btn-mail" href="javascript:;" style="display:none">Cancel</a>&nbsp;  <a class="" href="javascript:;"><span id="DeleteCommonDropdown" ids="' + a.iid + '" title="Delete ' + tag + '"><img src="/newassets/img/deletecasesingle-icon.png" /></span></a></td></tr>';
                });
                $("#assignuserCommonDropdown").append(html);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    /*Add common dropdown*/
    $("#btnAddCommonDropdown").click(function () {
        try {
            var tag = $("#Commondropdownhidden").val();
            var type = $("#Commondropdowntypehidden").val();
            var formData = new FormData();
            formData.append("type", type);
            var txtName = $("#txtNameCommonDropdown").val();
            if (txtName == "") {
                alert("Please select " + tag + " you wish to add.");
                return false;
            }
            formData.append("SubjectName", txtName.trim());
            openload();
            $.ajax({
                url: '/api/CallApi/InsertCommonDropdown',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    if (response.Data != "-1") {
                        new PNotify({
                            title: 'Success',
                            text: 'Data saved Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        LoadCommonDropdownList();
                        $("#txtNameCommonDropdown").val("");
                        try {
                            if (type == "Case_Type") {
                                localStorage.setItem("commondropdowntype", "true");
                            }
                            else if (type == "Case_Status") {
                                localStorage.setItem("commondropdownstatus", "true");
                            }
                        }
                        catch
                        {
                        }
                        closeload();
                    }
                    else {
                        new PNotify({
                            title: 'Warning',
                            text: tag + ' already exists.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    return false;
                }
            });
        }
        catch (er) {
            alert(er.message);
            closeload();
        }
    });
    $(document).on("click", "#DeleteCommonDropdown", function () {
        var tag = $("#Commondropdownhidden").val();
        var type = $("#Commondropdowntypehidden").val();
        if (confirm("Do you want to delete this " + tag + "?")) {
            var taskids = $(this).attr("ids");
            var formData = new FormData();
            formData.append("id", taskids);
            openload();
            $.ajax({
                url: '/api/CallApi/RemoveCommonDropdown',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (response) {
                    LoadCommonDropdownList();
                    try {
                        if (type == "Case_Type") {
                            localStorage.setItem("commondropdowntype", "true");
                        }
                        else if (type == "Case_Status") {
                            localStorage.setItem("commondropdownstatus", "true");
                        }
                    }
                    catch (er) {
                        //alert(er.message)
                    }
                    closeload();
                }
            });
            return false;
        }
    });

    //For Adding Plan Details
    //  $(document).on("click", "#accountdetails1", function () {
    $("#accountdetails").click(function () {
        var formData = new FormData();
        //read assign using list
        var d0 = $.ajax({
            async: true,
            type: "POST",
            url: "/CW/CWFirmPackDetails",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $('#accountdetailsmodal').modal('show');
                var datasApi = JSON.parse(response.Apiresult);
                var expirydata = JSON.parse(response.MKDeatils);
                //For Data Binding
                $("#Idfirmname").text(expirydata.FirmName);
                $("#Idplanname").text(expirydata.PackName);
                $("#IdSubscriptionStrDate").text(formatDatetoIST(expirydata.SubscriptionStartDate));
                $("#IdExpiryDate").text(formatDatetoIST(expirydata.ExpiryDate));
                $("#IdCaseQuota").text(datasApi.data[0].TotalCase);
                $("#IdBalenceQuota").text(datasApi.data[0].TotalCaseleft);

            }, //End of AJAX Success function
            failure: function (response) {
                alert(response.responseText);
                closeload();
            }, //End of AJAX failure function
            error: function (response) {
                alert(response.responseText);
                closeload();
            } //End of AJAX error function
        });

    });
    //For Comapny/Individual
    $("#btncompanydiv").click(function () {
        $("#divcltlead").show();
        $("#Icompanyorindi").val("company");
        $("#btncompanydiv").addClass("active");
        $("#btnindiaviudaldiv").removeClass("active");
    });
    $("#btnindiaviudaldiv").click(function () {
        $("#divcltlead").hide();
        $("#Icompanyorindi").val("user");
        $("#btnindiaviudaldiv").addClass("active");
        $("#btncompanydiv").removeClass("active");
    });
    $("#divcontcomp").click(function () {
        $("#divcompanydet").show();
        $("#divcontcomp").addClass("active");
        $("#divcontind").removeClass("active");
    });
    $("#divcontind").click(function () {
        $("#divcompanydet").hide();
        $("#divcontind").addClass("active");
        $("#divcontcomp").removeClass("active");
    });
    $("#addlivetrackingfinal").click(function () {
        var CaseName = $("#sideCasename").val();
        var teammember = $("#addtaskmember3").val();
        var urls = "/" + fcode + "/CW/LitigationAddLiveUpdate?type=0";
        url_redirect({
            url: urls,
            method: "post",
            data: { MatterName: CaseName, TeamMember: teammember }
        });
    });

    //Alerts send for locked feature 
    $("#requestacceses").click(function () {
        var moduletypes = $("#idlockedfeature").val();
        var formData = new FormData();
        formData.append('moduletypes', moduletypes);
        $.ajax({
            url: "/firm/LockedFeatureAlert",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "True") {
                    $("#myLockedfeatureBillingModal").modal("hide");
                    alert("Thanks for contacting us. We will reach you soon.")
                } else {
                    alert("Something went wrong!")
                }
            },
            error: function () {
                resolve(false);  // Resolve false in case of an error
            }
        });

    });
});

/*Show reminder chat*/
//function ShowChatReminderDiv() {
//    $.ajax({
//        async: true,
//        url: '/api/ChatApi/CheckChatJoinedByUser',
//        processData: false,
//        contentType: false,
//        type: 'POST',
//        success: function (response) {
//            if (response.Data.length > 0 && GetMinuteDiffrence() >= 10 && (sessionStorage.getItem("hidtempchatdisable") == null || sessionStorage.getItem("hidtempchatdisable") == "null")) {
//                if (dashchat == "display:unset") {
//                    $("#divChatReminder").show();
//                    $("#lnkchatdisablenew").text("Disable Chat Reminder");
//                }
//            }
//            else {
//                $("#divChatReminder").hide();
//                $("#lnkchatdisablenew").text("Enable Chat Reminder");
//            }
//        },
//        error: function (response) {
//            alert(response.responseText);
//        }
//    });
//}

/*Get difference =*/
function GetMinuteDiffrence() {
    var minutediff = 11;
    if ((sessionStorage.getItem("hidtempchattime") != null && sessionStorage.getItem("hidtempchattime") != "null")) {
        var comparedatetime = sessionStorage.getItem("hidtempchattime")
        var date1 = new Date(getDateTime());
        var date2 = new Date(comparedatetime);
        var diff = (date2.getTime() - date1.getTime()) / 1000;
        diff /= 60;
        minutediff = Math.abs(Math.round(diff));
    }
    return minutediff;
}
function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    if (month.toString().length == 1) {
        month = '0' + month;
    }
    if (day.toString().length == 1) {
        day = '0' + day;
    }
    if (hour.toString().length == 1) {
        hour = '0' + hour;
    }
    if (minute.toString().length == 1) {
        minute = '0' + minute;
    }
    if (second.toString().length == 1) {
        second = '0' + second;
    }
    var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dateTime;
}
//For Chat Link Open
//setInterval("ShowChatReminderDiv()", 60000);
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
function restrictAlphabetsfax(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode == 45 || charCode == 47) {
        return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


//Start For Check UnAuthorised click and open modal
async function validatePageLink(event, PageName, Action) {
    event.preventDefault(); // Prevents the default action (navigation)
    const result = await validatePage(PageName, Action);
    if (result) {
        if (event.target.href.indexOf("/") > 0) {
            window.location.href = event.target.href;
        } else {
            return true;
        }
    } else {
        $("#unauthorisedmodal").modal("show");
        return false; // Always return false to stop default link behavior
    }

}

function validatePage(PageName, Action) {
    var formData = new FormData();
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/firm/validatepage?PageValue=" + PageName + "&ActionName=" + Action,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response == "True") {
                    resolve(true);
                } else {
                    resolve(false);
                }
            },
            error: function () {
                resolve(false);  // Resolve false in case of an error
            }
        });
    });
}
//END For Check UnAuthorised click and open modal
function OpenActive(obj, type, packright) {

    if (packright == "display:none") {
        $("#idlockedfeature").val(type);
        $('#myLockedfeatureBillingModal').modal('show');
        // alert("You have not sunscribe this feature. Pls conatct to our team");
        return false;
    }
    else {
        //For Task Redirection
        if (type == "Task") {
            var fcode1 = localStorage.getItem("FirmCode");
            var urls = "/" + fcode1 + "/firm/UserTask";
            location.href = urls;
        }
        if (!$(obj).find(".nav-content").hasClass("collapse")) {
            $(obj).find(".nav-content").addClass("collapse");
            $(obj).find("p").removeClass("active");
        } else {
            $("#sidebar .nav-content").addClass("collapse")
            $(".nav-link p").removeClass("active")
            $(obj).find(".nav-content").removeClass("collapse");
            $(obj).find("p").addClass("active");
        }
    }
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

//For Modal Popup Close Option start section
$(document).on("click", "#clssavecloseorm", function () {
    $('#sideaddcase').hide();
});

$(document).on("click", "#clstaskform", function () {
    $('#sideaddtask').hide();
});

$(document).on("click", "#clscontactfrm", function () {
    $('#sideaddcontact').hide();
});

$(document).on("click", "#clstaskcomuni", function () {
    $('#sideaddcommu').hide();
});

$(document).on("click", "#clssidecasetools", function () {
    $('#sideaddtools').hide();
});
$(document).on("click", "#clssidecasetoolsLT", function () {
    $('#sideaddtoolsForLT').hide();
});
$(document).on("click", "#clshelp2closeorm", function () {
    $('#sideaddhelp2').hide();
});
$(document).on("click", "#clshelp1closeorm", function () {
    $('#sideaddhelp').hide();
});
//For Global Search Redirtion
$(document).on("click", "#idglobalsearch", function () {
    var cval = $('#global_searchval').val();
    if (cval == "") {
        alert("Please add the search keyword");
        return false;
    }

    var urls = "/" + fcode + "/Global/Search";
    url_redirect({
        url: urls,
        method: "post",
        data: { SeachValues: cval }
    });

    //window.location.href = "/" + fcode + "/Global/Search?token=" + cval;
});

function setFilesToInput(newFiles) {
    let input = document.getElementById("attachmentDriveTab1");
    let dt = new DataTransfer();

    for (let i = 0; i < input.files.length; i++) {
        dt.items.add(input.files[i]);
    }
    newFiles.forEach(f => dt.items.add(f));

    input.files = dt.files;
}
function displayExistingAddTask(fileName, fileId) {
    if (!fileName) return;

    // Optional: prevent duplicates by name+id
    const exists = selectedServerFiles.some(x =>
        (fileId && x.id === fileId) || (!fileId && x.name === fileName)
    );
    if (!exists) selectedServerFiles.push({ id: fileId || null, name: fileName });

    renderAllFiles();
}

function displayExistingAddCommunication(fileName, fileId) {
    if (!fileName) return;

    // Optional: prevent duplicates by name+id
    const exists = selectedServerFilesComm.some(x =>
        (fileId && x.id === fileId) || (!fileId && x.name === fileName)
    );
    if (!exists) selectedServerFilesComm.push({ id: fileId || null, name: fileName });

    renderAllFilesComm();
    //const fileList = $('#CommfileList');
    ////fileList.empty();
    //if (fileName) {
    //    const fileItem = `
    //   <div class="file-item">
    //            <span class="file-name">${fileName}</span>
    //            <span class="remove-file-add-comm" style="cursor:pointer;color:red;margin-left:10px;">✖</span>
    //        </div>
    //`;

    //    fileList.append(fileItem);
    //    $("#dropContainer").attr("title", "Document Attached");
    //    //$('#uploadTimerDiv').hide();
    //}
    //updateFileInputComm();
}


function updateFileInputComm() {
    const dt = new DataTransfer();
    selectedLocalFilesComm.forEach(file => dt.items.add(file));
    document.getElementById('attachmentcommu').files = dt.files;
}

function updateFileInput() {
    const dt = new DataTransfer();
    selectedLocalFiles.forEach(file => dt.items.add(file));
    document.getElementById('newtaskdocs').files = dt.files;
}

/* ===========================
   Helpers
=========================== */
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[s]));
}
function renderAllFilesComm() {
    const fileList = $('#CommfileList');
    fileList.empty(); // ✅ clear UI only

    // 1) Local files
    selectedLocalFilesComm.forEach((file, index) => {
        fileList.append(`
            <div class="file-item">
                <span class="file-name">${escapeHtml(file.name)}</span>
                <span class="remove-file remove-local-Comm" data-index="${index}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
    });

    // 2) Server files
    selectedServerFilesComm.forEach((f, index) => {
        fileList.append(`
            <div class="file-item">
                <span class="file-name">${escapeHtml(f.name)}</span>
                <span class="remove-file remove-server-Comm" data-index="${index}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
    });

    // Title update
    const total = selectedLocalFilesComm.length + selectedServerFilesComm.length;
    $("#dropContainer").attr("title", total > 0 ? "Document Attached" : "upload Attachment");

    updateFileInputComm(); // ✅ updates only local input files
}
function renderAllFiles() {
    const fileList = $('#fileList');
    fileList.empty(); // ✅ clear UI only

    // 1) Local files
    selectedLocalFiles.forEach((file, index) => {
        fileList.append(`
            <div class="file-item">
                <span class="file-name">${escapeHtml(file.name)}</span>
                <span class="remove-file remove-local" data-index="${index}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
    });

    // 2) Server files
    selectedServerFiles.forEach((f, index) => {
        fileList.append(`
            <div class="file-item">
                <span class="file-name">${escapeHtml(f.name)}</span>
                <span class="remove-file remove-server" data-index="${index}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `);
    });

    // Title update
    const total = selectedLocalFiles.length + selectedServerFiles.length;
    $("#dropContainer").attr("title", total > 0 ? "Document Attached" : "upload Attachment");

    updateFileInput(); // ✅ updates only local input files
}
var totalQuotaAITools = null;
var usedQuotaAITools = null;
var TotalUsedQuota = null;

function InsertAIToolsQuota(totalQuota, usedQuota, toolsType) {

    var data = {
        totalQuota: totalQuota,
        usedQuota: usedQuota,
        toolsType: toolsType
    };

    $.ajax({
        url: '/Firm/InsertAIToolsQuota',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {

            if (response.success) {
                console.log("Quota inserted successfully");
            } else {
                alert(response.message);
            }

        },
        error: function (err) {
            console.log(err);
        }
    });

}

function GetAIToolsQuota() {
    openload();
    $.ajax({
        url: '/Firm/GetAIToolsQuota',
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {

            if (response.length > 0) {

                var totalQuota = parseInt(response[0].totalQuota || 0);
                var usedQuota = parseInt(response[0].usedQuota || 0);
                TotalUsedQuota = parseInt(response[0].totalUsedQuota || 0);
                totalQuotaAITools = totalQuota;
                usedQuotaAITools = usedQuota;
                localStorage.setItem("totalQuotaAITools", totalQuota);
                localStorage.setItem("usedQuotaAITools", TotalUsedQuota);
                var remainingCredits = TotalUsedQuota - usedQuota;
                $("#aiCreditsText").text("AI Credits (" + remainingCredits + " left)");
                if (TotalUsedQuota >= totalQuota) {
                    //alert("Your AI Tools quota has been exhausted.");
                    return;
                }
                closeload();
            }

        },
        error: function (err) {
            console.log(err);
        }
    });

}

$(document).on("click", "#openCreditsDashboard", function () {

    loadCreditsDashboard();
    openload();
    $("#creditsDashboardModal").modal("show");

});
let creditsChart;

function loadCreditsDashboard() {

    $.ajax({
        url: '/Firm/GetAIToolsQuota',
        type: 'POST',
        success: function (response) {

            let tools = {
                "Generate Summary": 0,
                "Generate Chronology": 0,
                "Translate": 0,
                "Ask AI": 0,
                "Drafter": 0
            };

            let totalQuota = 0;
            let totalUsed = 0;

            $.each(response, function (i, item) {

                let tool = item.toolstype;
                let used = parseInt(item.usedQuota || 0);
                let quota = parseInt(item.totalQuota || 0);

                totalUsed += used;
                totalQuota = quota;
                if (!tool || tool === "Assigned To User") {
                    return true; 
                }

                if (tools.hasOwnProperty(tool)) {
                    tools[tool] = used;
                }

                tools[tool] = used;

            });

            $("#quotaSummary").text(tools["Generate Summary"]);
            $("#quotaChronology").text(tools["Generate Chronology"]);
            $("#quotaTranslate").text(tools["Translate"]);
            $("#quotaAskAI").text(tools["Ask AI"]);
            $("#quotaDrafter").text(tools["Drafter"]);

            $("#totalCreditsText").text(totalQuota);
            $("#usedCreditsText").text(totalUsed);
            $("#remainingCreditsText").text(totalQuota - totalUsed);

            createCreditsChart(tools);

        }
    });
}

function createCreditsChart(tools) {

    let labels = Object.keys(tools);
    let values = Object.values(tools);

    if (creditsChart) {
        creditsChart.destroy();
    }

    let ctx = document.getElementById('creditsChart').getContext('2d');
    closeload();
    creditsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Credits Used',
                data: values,
                backgroundColor: [
                    '#4CAF50',  // Generate Summary - green
                    '#2196F3',  // Generate Chronology - blue
                    '#FF9800',  // Translate - orange
                    '#9C27B0',  // Ask AI - purple
                    '#F44336'   // Drafter - red
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function loadChartJsAndRender(tools) {

    if (typeof Chart !== "undefined") {
        createCreditsChart(tools);
        return;
    }

    let script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    script.onload = function () {
        createCreditsChart(tools);
    };

    document.head.appendChild(script);
}

function displayExistingAddAITools(fileName, fileId) {
    if (!fileName) return;

    // Optional: prevent duplicates by name+id
    const exists = selectedServerFiles.some(x =>
        (fileId && x.id === fileId) || (!fileId && x.name === fileName)
    );
    if (!exists) selectedServerFiles.push({ id: fileId || null, name: fileName });
    $('.order-checkbox').prop('disabled', true);

    renderAllFilesAITools();
}
//function renderAllFilesAITools() {
//    const fileList = $('#fileListAITools');
//    fileList.empty(); // ✅ clear UI only

//    // 1) Local files
//    selectedLocalFiles.forEach((file, index) => {
//        fileList.append(`
//            <div class="file-item">
//                <span class="file-name" title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span>
//                <span class="remove-file remove-local" data-index="${index}"
//                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
//            </div>
//        `);
//    });

//    // 2) Server files
//    selectedServerFiles.forEach((f, index) => {
//        fileList.append(`
//            <div class="file-item">
//                <span class="file-name" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</span>
//                <span class="remove-file remove-server-AITools" data-index="${index}"
//                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
//            </div>
//        `);
//    });

//    // Title update
//    const total = selectedLocalFiles.length + selectedServerFiles.length;
//    $("#dropContainer").attr("title", total > 0 ? "Document Attached" : "upload Attachment");

//    updateFileInputAITools();
//}
function renderAllFilesAITools() {

    let html = "";

    // Priority: Local file > Server file
    let file = null;
    let type = "";

    if (selectedLocalFiles.length > 0) {
        file = selectedLocalFiles[selectedLocalFiles.length - 1]; // latest
        type = "local";
    } else if (selectedServerFiles.length > 0) {
        file = selectedServerFiles[selectedServerFiles.length - 1]; // latest
        type = "server";
    }

    if (file) {
        html = `
            <div class="file-item">
                <span class="file-name" title="${escapeHtml(file.name)}">
                    ${escapeHtml(file.name)}
                </span>
                <span class="remove-file ${type === "local" ? "remove-local" : "remove-server-AITools"}"
                      style="cursor:pointer;color:red;margin-left:10px;">✖</span>
            </div>
        `;
    }
    $('#fileListAITools').html(html);

    // Update title
    $("#dropContainer").attr("title", file ? "Document Attached" : "upload Attachment");

    updateFileInputAITools();
}

function updateFileInputAITools() {
    const dt = new DataTransfer();
    selectedLocalFiles.forEach(file => dt.items.add(file));
    document.getElementById('attachmentDriveTab1').files = dt.files;
}


//$(document).on('click', '.remove-server-AITools', function () {
//    const index = Number($(this).data('index'));
//    const removed = selectedServerFiles.splice(index, 1)[0];
//    $('.order-checkbox').prop('disabled', false);
//    localStorage.setItem("pathAITools", "");
//    renderAllFilesAITools();
//});

$(document).on('click', '.remove-server-AITools, .remove-local', function () {

    selectedLocalFiles = [];
    selectedServerFiles = [];
    $('#attachmentDriveTab1').val("");
    localStorage.removeItem("pathAITools");

    $('.order-checkbox').prop('disabled', false);
    renderAllFilesAITools();
});
