
window.selectedFilesTab1 = window.selectedFilesTab1 || [];

window.renderMkFilesTab1 = function () {
    console.log("aaya")
    const list = $("#mkFileListTab1");
    list.empty();

    const fCount = selectedFilesTab1.length;
    $("#selectedFileNameTab1").val(
        fCount === 0 ? "No file chosen" : `${fCount} file(s) selected`
    );

    selectedFilesTab1.slice(0, 5).forEach((item, i) => {
        list.append(`
          <div class="file-item d-flex align-items-center justify-content-between"
               style="border:1px solid #eee; padding:6px 10px; border-radius:6px; margin-top:6px;">
            <span class="file-name text-truncate" style="max-width:85%;">${item.name}</span>
            <span class="remove-mk-tab1" data-index="${i}"
                  style="cursor:pointer;color:red;margin-left:10px;">✖</span>
          </div>
        `);
    });

    if (fCount > 5) {
        list.append(`<div class="file-summary text-muted" style="margin-top:6px;">+${fCount - 5} more file(s)</div>`);
    }
};

$(document).on("click", ".remove-mk-tab1", function () {
    const idx = Number($(this).data("index"));
    selectedFilesTab1.splice(idx, 1);
    document.getElementById("ocrPreviewFrameTab1").src = "";
    document.getElementById("previewIframeTab1").src = "";
    renderMkFilesTab1();
});



function openMyKasePicker(e) {
  /*  e.preventDefault();*/
    console.log("MyKase button clicked ");

    // TODO: open your actual picker/modal here
    // Example:
    // $('#myModalbrowsedocs').modal('show');
}


function onMyKasePickedTab1(items) {
    console.log("onMyKasePickedTab1 calling", items);
    if (!Array.isArray(items) || items.length === 0) {
        console.warn("MyKase items emoty", items);
        return;
    }
   /* if (!Array.isArray(items) || items.length === 0) return;*/

    items.forEach(x => {
        selectedFilesTab1.push({
            source: "mykase",
            id: x.id,
            name: x.name,
            downloadUrl: x.downloadUrl || ""
        });
    });

    renderMkFilesTab1();
}












/**File validation */
$(document).ready(function () {
    // Load and render OCR history 
    loadOCRHistory();
    GetOCRQuotaData();
    // Filtering logic for the search input
    $('#ocrSearch').on('keyup', function () {
        const filter = $(this).val().toLowerCase();
        $('.date-group').each(function () {
            const $group = $(this);
            let anyVisible = false;

            $group.find('.history-item').each(function () {
                const visible = $(this).text().toLowerCase().includes(filter);
                $(this).toggle(visible);
                anyVisible = anyVisible || visible;
            });
            $group.toggle(anyVisible);
        });
    });
    $(document).on('click', '.history-item', function () {
        const jobId = $(this).attr('id').replace('job-', '');
        const filename = $(this).clone().children().remove().end().text().trim();
        const isGenerated = $(this).data('isgenerated');
        CheckAndGetOCRFilesHistory(jobId, filename);
    });
});

$('#Cancelbrowsefolder').on('click', function () {
    onMyKasePickedTab1(selectedItems);

    $('#myModalbrowsedocs').modal('hide');
});

function fileValidationTab1() {
    var fileInput = document.getElementById('attachmentDriveTab1');

    // ✅ IMPORTANT: files length is fileInput.files.length (not fileInput.length)
    const files = Array.from(fileInput.files || []);
    if (files.length === 0) return;

    // keep your existing validation (extension/type etc.)
    var filePath = fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf|\.gif|\.bmp|\.webp|\.tiff|\.tif)$/i;
    if (!allowedExtensions.exec(filePath)) {
        alert('Please upload file having extensions .jpeg/.jpg/.png/.pdf only.');
        fileInput.value = '';
        return false;
    }

    // ✅ push to same UI list
    files.forEach(f => {
        selectedFilesTab1.push({ source: "local", file: f, name: f.name });
    });

    renderMkFilesTab1();
    fileInput.value = "";
}

function abbyocr() {
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/OcrAbbyApi/ViewUserGroupsData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            // alert(datas1);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}
$(document).on("click", "#select_all", function () {
    $(".checkbox").prop('checked', $(this).prop('checked'));
});
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;

/*Load OCR file by page number*/
$(document).on('click', '#getdatabypagenum', function () {
    pageindex = $("#pagnumvalue").val();
    if (pageindex != "undefined") {
        if (Math.sign(pageindex) == 1) {
            var pageindesx = $("#sotopage").text();
            if (pageindex <= parseInt(pageindesx)) {
                loadocrfiles(pageindex);
                //closeload();
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

/*Save Sync Row Data*/
var selectedIDSync = new Array();
$(document).on("click", "#syncrqst", function () {
    selectedIDSync = [];
    var result = confirm("Are you sure to save data sync request?");
    if (result) {
        $('input:checkbox.checkbox').each(function () {
            if ($(this).prop('checked')) {
                var vdata = $(this).attr("data-val");
                selectedIDSync.push(vdata);
            }
        });
        if (JSON.stringify(selectedIDSync) != "[]") {
            var formdata = new FormData();
            formdata.append("token", selectedIDSync);
            formdata.append("tablekey", EncodeText("ocr"));
            openload1();
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
                        loadocrfiles(pageindex);
                        closeload1();
                    }
                    else {
                        closeload1();
                    }
                },
                error: function () {
                    closeload1();
                }
            });
        }
        else {
            new PNotify({
                title: 'Warning',
                text: 'You have not selected any row to sync?',
                type: 'error',
                delay: 3000
            });
            closeload1();
        }
    }
});
$(document).on('click', '#paginate', function () {
    pageindex = $(this).attr("index");
    loadocrfiles(pageindex);
});
var searchvar = "";
loadocrfiles(pageindex);

/*Load OCR files*/
function loadocrfiles(pageindex) {
    var html = '';
    $("#assignuserdata").html("");
    var formData = new FormData();
    formData.append("search", EncodeText(searchvar));
    formData.append("pagenum", EncodeText(pageindex));
    formData.append("pagesize", EncodeText(pagesize));
    //read assign using list
    qty1 = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/OcrInvoiceApi/Loadocrfilesbyrowid",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $("#tfooter").html("");
            var datas1 = JSON.stringify(response1);
            var obj = JSON.parse(response1.Data);
            var length = obj.length;
            $.each(obj, function (i, a) {
                if (i === 0) {
                    firstvalue = a.RowNumber;
                }
                if (i === (length - 1)) {
                    var pnext = pageindex;
                    var pprev = pageindex;
                    var pageno = pageindex;
                    var totdata = a.TotRecords;
                    var totpage = 0;
                    if (a.TotRecords > 1) {
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
                    tfot += '&nbsp;&nbsp;|&nbsp;&nbsp;<b style="font-size:12px;">' + firstvalue + '-' + a.RowNumber + '</b> of <b style="font-size:12px;">' + a.TotRecords + ' Entries</b>'
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
                }
                qty1 = qty1 + 1;
                if (a.details == null) {
                    details = "";
                }
                else {
                    details = a.details;
                }
                if (String(a.IsSync) == "1") {
                    dsyncicon = "glyphicon glyphicon-retweet";
                    dsynctitle = "Marked for data synchronization";
                }
                else {
                    dsyncicon = "";
                    dsynctitle = "";
                }
                var ftoken = "/DownloadFile.ashx?module=ocr&ocrdocname=" + enctypesingle(a.Filename) + "&ftoken=" + a.Id;
                html += '<tr><td><input type="checkbox" fpath-val="" data-val="' + a.Id + '" data-flag="-1"  fname-val="' + a.Filename + '" class="checkbox"/></td><td>' + qty1 + '</td><td><a name="' + a.Filename + '" id="openocrcontent" data-file="' + a.Filename + '" data-val="' + a.Id + '" href="javascript:void(0);"  download="' + a.Filename + '" title="Download File">' + a.Filename + '</a> <i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i></td><td>' + details + '</td><td>' + formatDatetoIST(a.date_time) + " " + String(a.date_time).substring(11, 19) + '</td><td>' + a.UserName + '</td><td><a href="' + ftoken + '" class="btn btn-mail btn-success" title="Download file"><span class="glyphicon glyphicon-save" ></span>&nbsp; </a>&nbsp;&nbsp;<a data-val="' + a.Id + '" id="removeocrfile" class="btn btn-mail btn-danger" title="Remove file"><span class="glyphicon glyphicon-trash" ></span>&nbsp; </a></td></tr>';
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


/*Bind OCR file in dropdown*/
function BindocrfilesForDDL() {
    var html = '';
    $("#ddlOCRList").html("");
    var formData = new FormData();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/OcrInvoiceApi/BindOcrfilelistForDDl",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var datas1 = JSON.stringify(response1);
            var obj = JSON.parse(response1.Data);
            var length = obj.length;
            html = '<option value="">Select One </option>';
            $.each(obj, function (i, a) {
                html += '<option value="' + a.Id + '">' + a.Filename + ' </option>';
            });
            $("#ddlOCRList").append(html);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

/*Bind dropdown OCR list*/
$(document).on('change', '#ddlOCRList', function () {
    var ffilename = $("#ddlOCRList option:selected").html();
    var typeid = $("#ddlOCRList").val();
    if (typeid != "") {
        $("#removeocrfile").attr("data-val", typeid);
        LoadocrcontentNew(typeid);
        var formData = new FormData();
        formData.append("token", EncodeText(typeid));
        formData.append("docname", EncodeText(ffilename));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/OcrInvoiceApi/LoadOcrFile",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                var hostname = window.location.hostname;
                var pather = window.location.origin + "//" + data.Data;
                $("#iOriginalContent").attr("src", pather);
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

/*Load OCR new content by type id*/
function LoadocrcontentNew(typeid) {
    var formData = new FormData();
    formData.append("token", EncodeText(typeid));
    try {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/OcrInvoiceApi/LoadOcrContent",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                var datas1 = JSON.stringify(data.Data.Result);
                var obj = JSON.parse(data.Data.Result);
                $("#desc").val(obj[0].details);
                if (data.Data.content == "") {
                    $('#divOCRContent').append("No Cause list Available.");
                }
                else {
                    $("#divOCRContent").html(String(data.Data.content).replace(/\\n|\\r\\n|\\r/g, '<br/>').slice(1, -1).slice(1, -1));
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
    catch (err) {
        alert(err.message);
    }
}
$(document).ready(function () {
    $("#notFoundSection").show();
    BindocrfilesForDDL();
    $(document).on("click", "#openocrcontent", function () {
        openload2();
        var fileid = $(this).attr("data-val");
        var filename = $(this).attr("data-file");
        filename = filename.split(' ').join('+');
        var url = "/firm/OcrFileList/?token=" + fileid + "&docname=" + filename;
        $('.mymodels').load(url, function (result) {
            closeload2();
            $('#myModal').modal({ show: true });
        });
    });
    $('#searchtype').on('change', function () {
        var value = $(this).val();
        if (value == "2") {
            $("#searchdata").css("display", "none");
            $("#searchdatainfile").css("display", "block");
            $("#btnsearch").css("display", "none");
            $("#btnsearchcontent").css("display", "block");
        }
        else {
            $("#searchdatainfile").css("display", "none");
            $("#searchdata").css("display", "block");
            $("#btnsearchcontent").css("display", "none");
            $("#btnsearch").css("display", "block");
        }
    });
    $(document).on("click", "#btnsearchcontent", function () {
        searchvar = $("#searchdatainfile").val();
        loadocrfiles(pageindex);
    })
    $(document).on("click", "#back", function () {
        searchvar = "";
        loadocrfiles(pageindex);
    })

    /*Remove OCR files*/
    $(document).on("click", "#removeocrfile", function () {
        var fileid = $(this).attr("data-val");
        var formData = new FormData();
        formData.append("fileid", EncodeText(fileid));
        qty1 = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/OcrInvoiceApi/RemoveOcrFile",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                new PNotify({
                    title: 'Success!',
                    text: ' File removed successfully',
                    type: 'success',
                    delay: 3000
                });
                $("#notFoundSection").show();
                $("#divOCRContent").html("");
                $("#iOriginalContent").attr("src", "");
                BindocrfilesForDDL();
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });
    function msToTime(ms) {
        var seconds = (ms / 1000);
        var minutes = parseInt(seconds / 60, 10);
        seconds = seconds % 60;
        var hours = parseInt(minutes / 60, 10);
        minutes = minutes % 60;
        return hours + 'h:' + minutes + 'm:' + seconds.toFixed(0) + 's';
    }
    /*Generate random file*/
    function randomString() {
        var chars = "012345";
        var string_length = 2;
        var randomstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
        }
        return randomstring;
    }
    function openload1() {
        $('#myOverlay1').css("display", "block");
    }
    function closeload() {
        $('#myOverlay1').css("display", "none");
    }
    function openload2() {
        $('#myOverlay').css("display", "block");
    }
    function closeload2() {
        $('#myOverlay').css("display", "none");
    }

    let pageLimitExceeded = false;

    $("#savecasefilenew").click(function () {
        const files = document.getElementById("attachmentDriveTab1").files;
        let MAX_PAGES = 0;

        GetOCRQuotaData().then(value => {
            MAX_PAGES = value;
        });

        if (files.length === 0) {
            alert("Please choose at least one file to upload.");
            return;
        }

        const supportedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/webp",
            "image/tiff"
        ];

        $('#myOverlay').show();
        $('#overlayBackdrop').show();

        let totalPages = 0;

        function validateFile(file) {
            return new Promise((resolve, reject) => {
                if (!supportedTypes.includes(file.type)) {
                    alert(`File type ${file.type} not supported.`);
                    return resolve(null);
                }

                if (file.type === "application/pdf") {
                    const reader = new FileReader();
                    reader.onload = function () {
                        const typedArray = new Uint8Array(reader.result);
                        pdfjsLib.getDocument({ data: typedArray }).promise
                            .then(function (pdf) {
                                if (totalPages + pdf.numPages > MAX_PAGES) {
                                    alert(`You have ${MAX_PAGES} page(s) remaining in your OCR quota. Please purchase additional quota to continue using OCR.`);
                                    pageLimitExceeded = true;
                                    $('#selectedFileNameTab1').val('');
                                    document.getElementById("ocrPreviewFrameTab1").style.display = "none";
                                    document.getElementById("ocrPreviewContainerTab1").style.display = "none";
                                    resolve(null);
                                } else {
                                    totalPages += pdf.numPages;
                                    resolve(file);
                                }
                            })
                            .catch(function (error) {
                                alert(`Unable to read PDF: ${file.name}. Error: ${error.message}`);
                                resolve(null);
                            });
                    };
                    reader.readAsArrayBuffer(file);
                } else {
                    if (totalPages + 1 > MAX_PAGES) {
                        alert(`Only up to ${MAX_PAGES} pages allowed. Adding "${file.name}" would exceed the limit.`);
                        return resolve(null);
                    }
                    totalPages += 1;
                    resolve(file);
                }
            });
        }

        Promise.all(Array.from(files).map(validateFile))
            .then(results => {
                const validFiles = results.filter(f => f !== null);

                if (validFiles.length === 0 || pageLimitExceeded) {
                    $('#myOverlay').hide();
                    $('#overlayBackdrop').hide();
                    return;
                }

                uploadFiles(validFiles);
            })
            .catch(() => {
                $('#myOverlay').hide();
                $('#overlayBackdrop').hide();
                alert("An error occurred during file validation.");
            });

        function uploadFiles(validFiles) {
            let formData = new FormData();

            validFiles.forEach(file => {
                formData.append("files", file);
            });

            $.ajax({
                url: "/Firm/ConvertToOCR",
                type: "POST",
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (response) {
                    $('#myOverlay').hide();
                    $('#overlayBackdrop').hide();

                    if (response && response.job_id) {
                        localStorage.setItem("ocr_job_id", response.job_id);
                        //alert("Your document has been uploaded successfully. The OCR-generated content will be available within 24 hours.");
                        //$("#attachmentTab1").val("");
                        //$("#attachmentDriveTab1").val("");
                        //$('#selectedFileNameTab1').val("");
                        //document.getElementById("ocrPreviewFrameTab1").style.display = "none";
                        //document.getElementById("ocrPreviewContainerTab1").style.display = "none";
                        const fileNames = validFiles.map(file => file.name);
                        CheckAndShowOCRFiles(response);
                        UpdateOCRPageQuota(totalPages);
                        setTimeout(() => {
                            loadOCRHistory();
                        }, 500);
                    } else {
                        $('#myOverlay').hide();
                        $('#overlayBackdrop').hide();
                    }
                },
                error: function () {
                    $('#myOverlay').hide();
                    $('#overlayBackdrop').hide();
                    alert("Failed to upload or process the file. Please try again.");
                }
            });
        }
    });;

    function UpdateOCRPageQuota(totalPages) {
        $.ajax({
            url: "/Firm/UpdateUsedOCRQuota",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ totalPages: totalPages }),
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    console.log("OCR quota updated successfully.");
                } else {
                    console.log("Failed to update OCR quota: " + (response.message || "Unknown error"));
                }
            },
            error: function (xhr, status, error) {
                console.log("Error updating OCR quota: " + error);
            }
        });
    }
});

function loadOCRHistory() {
    $('#myOverlayOCR').show();
    $.ajax({
        url: '/Firm/GetAllOCRFileDetails',
        type: 'POST',
        dataType: 'json',
        success: function (res) {
            if (!res.success) {
                if (res.message === 'No records found.') {
                    noOcrMessage.style.display = 'block';
                } else {
                    noOcrMessage.style.display = 'block';
                }
                $('#myOverlayOCR').hide();
                return;
            }

            noOcrMessage.style.display = 'none';
            const grouped = {};
            res.data.forEach(item => {
                const dateKey = formatDate(item.CreatedOn);
                grouped[dateKey] = grouped[dateKey] || [];
                grouped[dateKey].push(item);
            });

            const container = $('#ocrHistory').empty();
            for (const date in grouped) {
                const $group = $(`
                    <div class="date-group">
                        <div class="date-header" style="font-weight:600;cursor:pointer;padding:6px 0;color:dodgerblue;">
                            <i class="bi bi-calendar3 me-1"></i> ${date}
                        </div>
                        <div class="history-files" style="margin-left:10px;"></div>
                    </div>
                `);

                grouped[date].forEach(item => {
                    const files = Array.isArray(item.FileNames)
                        ? item.FileNames
                        : item.FileNames.split(',');

                    files.forEach(fileName => {
                        const trimmed = fileName.trim();
                        const $item = $(`
                            <div id="job-${item.JobID}" class="history-item" style="padding:8px;border-bottom:1px solid #ddd;cursor:pointer;" data-isgenerated="${item.IsGenerated ? 1 : 0}">
                                <i class="bi bi-file-earmark-text me-1"></i> ${trimmed}
                            </div>
                        `);
                        $group.find('.history-files').append($item);
                    });
                });

                $group.appendTo(container);
                $('#myOverlayOCR').hide();
            }
            $('.date-header').on('click', function () {
                $(this).next('.history-files').slideToggle(100);
                $('#myOverlayOCR').hide();
            });
        },
        error: function (err) {
            console.error('Failed to load OCR history:', err);
            $('#myOverlayOCR').hide();
        }
    });
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}
async function CheckAndGetOCRFiles(jobId, filename, isGenerated) {
    localStorage.setItem("fileName", filename);
    const ocrBaseUrl = $('#OCRBaseUrl').val();
    if (isGenerated === 1 || isGenerated === "1") {
        const sourceUrl = `${ocrBaseUrl}jobs/${jobId}/source/${filename}`;
        const resultUrl = `${ocrBaseUrl}jobs/${jobId}/result`;

        //Source File
        fetch(sourceUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
            })
            .then(blob => {
                const fileType = blob.type;
                if (fileType === "application/pdf" || fileType.startsWith("image/") || fileType.type === "text/html") {
                    const blobUrl = URL.createObjectURL(blob);
                    const iframe = document.getElementById('ocrPreviewFrameTab1');
                    iframe.src = blobUrl;
                    iframe.style.display = 'block';
                } else {
                    alert("There was some issue loading the file. Please try again after some time.");
                }
            })
            .catch(error => {
                console.error("Error fetching file:", error);
                alert("There was some issue loading the file. Please try again after some time.");
            });
        //OCR result
        try {
            const res = await fetch(resultUrl);
            if (!res.ok) throw new Error("There was some issue loading the file. Please try again after some time.");

            const blob = await res.blob();

            if (blob.type === "application/zip") {
                const zip = await JSZip.loadAsync(blob);

                let matchedFile = null;
                const inputBaseName = filename.split('.')[0].toLowerCase();
                zip.forEach((relativePath, zipEntry) => {
                    const zipFileName = zipEntry.name.split('/').pop();
                    const zipBaseName = zipFileName.split('.')[0].toLowerCase();

                    if (zipBaseName === inputBaseName) {
                        matchedFile = zipEntry;
                    }
                });

                if (!matchedFile) {
                    alert("There was some issue loading the file. Please try again after some time.");
                    return;
                }

                // Extract matched file as blob and show in iframe
                const rawBlob = await matchedFile.async("blob");
                const mimeType = getSupportedMimeType(matchedFile.name);
                const extractedBlob = new Blob([rawBlob], { type: mimeType });

                if (mimeType === "application/pdf" || mimeType.startsWith("image/") || mimeType === "text/html") {
                    const blobUrl = URL.createObjectURL(extractedBlob);
                    const resultIframe = document.getElementById('previewIframeTab1');
                    resultIframe.src = blobUrl;
                    resultIframe.style.display = 'block';
                } else {
                    alert("There was some issue loading the file. Please try again after some time.");
                    return;
                }

            } else {
                // Not a zip, show directly in iframe
                if (blob.type === "application/pdf" || blob.type.startsWith("image/") || blob.type === "text/html") {
                    const blobUrl = URL.createObjectURL(blob);
                    const resultIframe = document.getElementById('previewIframeTab1');
                    resultIframe.src = blobUrl;
                    resultIframe.style.display = 'block';
                } else {
                    alert("There was some issue loading the file. Please try again after some time.");
                    return;
                }
            }
        } catch (error) {
            console.error("Result fetch error:", error);
            alert("There was some issue loading the file. Please try again after some time.");
            return;
        }

    } else {
        alert("The OCR-generated content will be available within 24 hours.");
    }
}

async function CheckAndShowOCRFiles(response) {
    try {
        const jobId = response.job_id;
        const fileNames = response.submitted_files.join(",");
        let ocrResults = [];

        const resultRes = await pollOCRResult(response.links.result);
        if (!resultRes || !resultRes.ok) {
            alert("OCR result is not available yet. Please try again later!");
            return;
        }

        const resultBlob = await resultRes.blob();

        const previewIframe = document.getElementById("previewIframeTab1");
        const extraContainer = document.getElementById("divOCRContentTab1");
        previewIframe.style.display = "none";
        previewIframe.removeAttribute("src");
        extraContainer.innerHTML = "";
        if (resultBlob.type === "application/zip") {
            const zip = await JSZip.loadAsync(resultBlob);
            let isFirst = true;

            for (const fileName of Object.keys(zip.files)) {
                const zipEntry = zip.files[fileName];
                if (!zipEntry.dir) {
                    const rawBlob = await zipEntry.async("blob");
                    const mimeType = getSupportedMimeType(fileName);
                    const extractedBlob = new Blob([rawBlob], { type: mimeType });
                    const blobUrl = URL.createObjectURL(extractedBlob);

                    if (isFirst) {
                        const previewIframe = document.getElementById("previewIframeTab1");
                        previewIframe.src = blobUrl;
                        previewIframe.style.display = "block";
                        isFirst = false;
                    } else {
                        const container = document.getElementById("divOCRContentTab1");
                        const iframe = document.createElement("iframe");
                        iframe.src = blobUrl;
                        iframe.style.width = "100%";
                        iframe.style.height = "400px";
                        iframe.style.border = "1px solid #ccc";
                        iframe.style.marginBottom = "10px";
                        container.appendChild(iframe);
                    }

                    if (mimeType.startsWith("text/") || mimeType === "application/json") {
                        const text = await extractedBlob.text();  // FIX: use extractedBlob
                        ocrResults.push({
                            fileName: fileName,
                            text: text
                        });
                    }
                }
            }
        }
        else {
            const mimeType = resultBlob.type;
            const blobUrl = URL.createObjectURL(resultBlob);

            if (mimeType === "application/pdf" || mimeType.startsWith("image/") || mimeType === "text/html") {
                previewIframe.src = blobUrl;
                previewIframe.style.display = "block";
            }

            if (mimeType.startsWith("text/") || mimeType === "application/json") {
                const text = await resultBlob.text();
                ocrResults.push({
                    fileName: response.submitted_files[0] || "result.txt",
                    text: text
                });
            }
        }

        SaveOCRFileDetails(jobId, fileNames, ocrResults);

    } catch (error) {
        $('#myOverlay').hide();
        $('#overlayBackdrop').hide();
        console.error("Error in CheckAndShowOCRFiles:", error);
    }
}


async function pollOCRResult(resultUrl, interval = 9000, maxAttempts = 30) {
    let attempts = 0;

    $('#myOverlay').show();
    $('#overlayBackdrop').show();

    while (attempts < maxAttempts) {
        try {
            const res = await fetch(resultUrl);
            const contentType = res.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const json = await res.json();
                const status = json.status ? json.status.toLowerCase() : "";
                if (status === "processing" || status === "pending") {
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, interval));
                    continue;
                }
            }

            $('#myOverlay').hide();
            $('#overlayBackdrop').hide();
            return res;

        } catch (err) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }

    $('#myOverlay').hide();
    $('#overlayBackdrop').hide();
    alert("Please upload correct file.");
    throw new Error("❌ OCR result not ready after max attempts");
}

function getSupportedMimeType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
        case 'pdf':
            return 'application/pdf';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
        case 'bmp':
        case 'svg':
            return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
        case 'html':
        case 'htm':
            return 'text/html';
        default:
            return '';
    }
}

function GetOCRQuotaData() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "/Firm/GetOCRLimit",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    const total = response.totalQuota || 0;
                    const used = response.usedQuota || 0;
                    const remaining = total - used;
                    const quotaText = document.getElementById('quotaText');
                    quotaText.innerHTML = `<span class="pbarvalue">${remaining}</span> of <span>${total}</span> quotas remaining`;

                    // Calculate percentage for the progress bar (adjust the formula as needed)
                    const percentage = (used / total) * 100;

                    // Update the progress bar width
                    const progressBar = document.getElementById('progressBar1');
                    progressBar.style.width = percentage + '%';
                    resolve(remaining);
                } else {
                    const quotaText = document.getElementById('quotaText');
                    quotaText.innerHTML = `<span class="pbarvalue">0</span> of <span>0</span> quotas remaining`;

                    const progressBar = document.getElementById('progressBar1');
                    progressBar.style.width = '0%';

                    resolve(0);
                }
            },
            error: function (xhr, status, error) {
                console.log("Error getting OCR quota: " + error);
                reject(error);
            }
        });
    });
}

//E-mail function 
async function sendEmailModal() {
    const recipient = document.getElementById("recipientEmail").value.trim();
    const iframe = document.getElementById("previewIframeTab1");
    const userMessage = document.getElementById("emailMessage").value.trim();
    const filename = localStorage.getItem("fileName") || "document";

    if (!recipient) {
        alert("Please enter a recipient email.");
        return;
    }

    if (!iframe) {
        alert("File not found.");
        return;
    }

    const subject = `OCR: ${filename}`;

    try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const iframeContent = iframeDocument.body;
        const pdfBlob = await htmlToPDFBlob(iframeContent, filename);

        const base64Pdf = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result.split(',')[1];
                resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(pdfBlob);
        });

        const payload = {
            To: recipient,
            Subject: subject,
            Message: userMessage,
            AttachmentBase64: base64Pdf,
            AttachmentFileName: `${filename}.pdf`
        };
        $('#myOverlayOCR').show();
        const response = await fetch('/Firm/SendOcrEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            $('#myOverlayOCR').hide();
            alert("E-mail has been sent successfully.");
            document.getElementById("recipientEmail").value = "";
            document.getElementById("emailMessage").value = "";
            closeEmailModal();
        } else {
            const errorText = await response.text();
            alert("There is some error while sending the E-mail. Please try again.");
        }
    } catch (error) {
        alert("There is some error while sending the E-mail. Please try again.");
    }
}

function htmlToPDFBlob(element, filename) {
    return new Promise((resolve, reject) => {
        const options = {
            margin: 0.5,
            filename: `${filename}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).outputPdf('blob').then(resolve).catch(reject);
    });
}

//function openMyKasePicker(event) {
//    event.preventDefault();
//}

function SaveOCRFileDetails(jobId, fileNames, generatedOCRText) {
    const originalPath = (window.uploadedFileURLs || []).map(f => f.url).join(",");
    $.ajax({
        url: '/Firm/SaveOCRFileDetails',
        type: 'POST',
        data: JSON.stringify({ jobId: jobId, fileNames: fileNames, ocrResults: generatedOCRText, originalPath: originalPath }),
        contentType: 'application/json',
        success: function (response) {
            console.log("File details saved.");
            window.uploadedFileURLs = [];
        },
        error: function () {
            console.error("Failed to save file details.");
        }
    });
}

function CheckAndGetOCRFilesHistory(jobId, filename) {
    $('#myOverlayOCR').show();
    $('#overlayBackdrop').show();
    $.ajax({
        url: '/Firm/GetAllOCRFileDetails',
        type: 'POST',
        dataType: 'json',
        success: function (res) {
            if (!res.success) {
                noOcrMessage.style.display = 'block';
                $('#myOverlayOCR').hide();
                return;
            }

            if (res.data && res.data.length > 0) {
                // find the OCR entry that matches the given jobId
                const matched = res.data.find(item => item.JobID === jobId && item.FileNames === filename);

                if (matched) {
                    if (matched.OriginalFilePath) {
                        const fileIframe = document.getElementById('ocrPreviewFrameTab1');
                        fileIframe.style.display = 'block';
                        fileIframe.src = matched.OriginalFilePath;
                    }
                    const generatedHtml = matched.GeneratedOCR;
                    const resultIframe = document.getElementById('previewIframeTab1');

                    // Make iframe visible
                    resultIframe.style.display = 'block';

                    // Inject HTML into iframe
                    const iframeDoc = resultIframe.contentDocument || resultIframe.contentWindow.document;
                    iframeDoc.open();
                    iframeDoc.write(generatedHtml);
                    iframeDoc.close();
                } else {
                    console.warn("No OCR found for JobID:", jobId);
                    noOcrMessage.style.display = 'block';
                }
            }
            $('#myOverlayOCR').hide();
            $('#overlayBackdrop').hide();
        },
        error: function (err) {
            console.error('Failed to load OCR history:', err);
            $('#myOverlayOCR').hide();
            $('#overlayBackdrop').hide();
        }
    });
}

