//var AIUserCaseId = null;

//$(document).ready(function () {
//    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
//    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

//    var setPageNo = 1;
//    renderOrdersDataSummary(pageindex, "", "");

//    $(".tab-header div").click(function () {
//        $(".tab-header div").removeClass("active");
//        $(".tab-content").removeClass("active");

//        $(this).addClass("active");

//        if (this.id === "tabOrderSummary") {
//            $("#orderSummaryTab").addClass("active");
//            $('#aiSummaryLogContainer').hide();
//            $('#aiChronologyLogContainer').hide();
//            $('#chronologyTab').hide();
//            isRenderPage = false;
//            renderOrdersDataSummary(pageindex, "", "");
//        } else if (this.id === "tabChronology") {
//            $("#chronologyTab").addClass("active");
//            $('#aiSummaryLogContainer').hide();
//            $('#aiChronologyLogContainer').hide();
//            $('#orderSummaryTab').hide();
//            isRenderPageChronology = false;
//            renderOrdersDataChronology(pageindex, "", "");
//        } else if (this.id === "tabViewSummaries") {
//            $("#aiSummaryLogContainer").addClass("active").show();
//            $('#aiChronologyLogContainer').hide();
//            $('#orderSummaryTab').hide();
//            $('#chronologyTab').hide();
//            loadSummaryLogTable();
//        } else if (this.id === "tabViewChronologies") {
//            $("#aiChronologyLogContainer").addClass("active").show();
//            $('#aiSummaryLogContainer').hide();
//            $('#orderSummaryTab').hide();
//            $('#chronologyTab').hide();

//            loadChronologyLogTable();
//        }
//    });
//});

//$("#casefiltercourtSummary").change(function () {
//    loadflag = true;
//    isRenderPage = false;
//    renderOrdersDataSummary(1, "", "");
//});

//$("#casefiltercourtChronology").change(function () {
//    loadflag = true;
//    isRenderPage = false;
//    renderOrdersDataChronology(1, "", "");
//});
//var tatalRecordCount = 1;
////Search Matter Name Summary
//$("#searchdatassummary").click(function () {
//    var casefiltercasename = $("#casefiltercasenamesummary").val();
//    if (casefiltercasename == "") {
//        alert("Please enter the matter name.");
//        $("#casefiltercasenamesummary").focus();
//        return false;
//    }
//    $("#clearnewsearchcasesummary").css("display", "block");
//    $("#casefiltercasenamesummary").css("display", "block");
//    $("#searchdatassummary").css("display", "none");
//    loadflag = true;
//    isRenderPage = false;
//    renderOrdersDataSummary(1, "", "");
//    chksflag = true;
//});
////Search Matter Name Summary
//$("#searchdataschronology").click(function () {
//    var casefiltercasename = $("#casefiltercasenameChronology").val();
//    if (casefiltercasename == "") {
//        alert("Please enter the matter name.");
//        $("#casefiltercasenameChronology").focus();
//        return false;
//    }
//    $("#clearnewsearchcasechronology").css("display", "block");
//    $("#casefiltercasenameChronology").css("display", "block");
//    $("#searchdataschronology").css("display", "none");
//    loadflag = true;
//    isRenderPageChronology = false;
//    renderOrdersDataChronology(1, "", "");
//    chksflag = true;
//});
//$("#clearnewsearchcasesummary").click(function () {
//    $("#casefiltercasenamesummary").val("");
//    //$("#clearnewsearchcase").css("display", "none");
//    $("#clearnewsearchcasesummary").css("display", "none");
//    $("#casefiltercasenamesummary").css("display", "block");
//    $("#searchdatassummary").css("display", "block");
//    loadflag = true;
//    isRenderPage = false;
//    renderOrdersDataSummary(1, "", "");
//    chksflag = true;
//})
//$("#clearnewsearchcasechronology").click(function () {
//    $("#casefiltercasenameChronology").val("");
//    //$("#clearnewsearchcase").css("display", "none");
//    $("#clearnewsearchcasechronology").css("display", "none");
//    $("#searchdataschronology").css("display", "block");
//    $("#casefiltercasenameChronology").css("display", "block");
//    loadflag = true;
//    isRenderPageChronology = false;
//    renderOrdersDataChronology(1, "", "");
//    chksflag = true;
//})

////Search Court Case No Summary
//$("#searchdatasmtrnosummary").click(function () {
//    var casefiltermtrno = $("#casefiltermtrnosummary").val();
//    if (casefiltermtrno == "") {
//        alert("Please enter the Matter Number-External Reference.");
//        $("#casefiltermtrnosummary").focus();
//        return false;
//    }
//    $("#searchdatasmtrnosummary").css("display", "none");
//    $("#clearnewsearchmtrnosummary").css("display", "unset")
//    loadflag = true;
//    isRenderPage = false;
//    renderOrdersDataSummary(1, "", "");
//    chksflag = true;
//});
//$("#clearnewsearchmtrnosummary").click(function () {
//    $("#casefiltermtrnosummary").val("");
//    $("#clearnewsearchmtrnosummary").css("display", "none");
//    $("#searchdatasmtrnosummary").css("display", "unset");
//    loadflag = true;
//    isRenderPage = false;
//    renderOrdersDataSummary(1, "", "");
//    chksflag = true;
//})

////Search Court Case No Chronology
//$("#searchdatasmtrnochronology").click(function () {
//    var casefiltermtrno = $("#casefiltermtrnochronology").val();
//    if (casefiltermtrno == "") {
//        alert("Please enter the Matter Number-External Reference.");
//        $("#casefiltermtrnochronology").focus();
//        return false;
//    }
//    $("#searchdatasmtrnochronology").css("display", "none");
//    $("#clearnewsearchmtrnochronology").css("display", "unset")
//    loadflag = true;
//    isRenderPageChronology = false;
//    renderOrdersDataChronology(1, "", "");
//    chksflag = true;
//});
//$("#clearnewsearchmtrnochronology").click(function () {
//    $("#casefiltermtrnochronology").val("");
//    $("#clearnewsearchmtrnochronology").css("display", "none");
//    $("#searchdatasmtrnochronology").css("display", "unset");
//    loadflag = true;
//    isRenderPageChronology
//    renderOrdersDataChronology(1, "", "");
//    chksflag = true;
//})
//function renderOrdersDataSummary(pageindex, searchcolnaame, searchcolvalue) {
//    $("#summaryCount").text("");
//    $("#bindcasedataSummary").empty();
//    $('#chronologyTab').hide();
//    $('#orderSummaryTab').show();
//    setPageNo = pageindex;
//    isRenderPage = false;
//    const pageSize = 10;
//    const formdata = new FormData();
//    formdata.append("pagenum", EncodeText(pageindex));
//    formdata.append("pagesize", EncodeText(pageSize));
//    // All filter values remain the same
//    formdata.append("odate", "");
//    formdata.append("casename", EncodeText($('#casefiltercasenamesummary').val()));
//    formdata.append("clientname", "");
//    formdata.append("court", EncodeText($('#casefiltercourtSummary').val()));
//    formdata.append("cstatus", "");
//    formdata.append("createdby", "");
//    formdata.append("users", "");
//    formdata.append("companyfilter", "");
//    formdata.append("mattertypefilter", "Litigation");
//    formdata.append("subjecttypefilter", "");
//    formdata.append("casefilternotes", "");
//    formdata.append("casefiltercourtname", "");
//    formdata.append("odateto", "");
//    formdata.append("fillingdate", "");
//    formdata.append("fillingdateto", "");
//    formdata.append("searchcustomcolname", "");
//    formdata.append("searchcustomcolvalue", "");
//    formdata.append("casedisposefilter", "");
//    formdata.append("casefilterCaseDetails", "");
//    formdata.append("casefiltermtrno", EncodeText($('#casefiltermtrnosummary').val()));
//    formdata.append("casefilterInternalno", "");
//    formdata.append("casefiltercnrno", "");
//    formdata.append("caseredirectfilter", "");
//    formdata.append("NextHearingfromd", "");
//    formdata.append("NextHearingtod", "");
//    formdata.append("CourtStatusfiletr", "");
//    formdata.append("casedetailsfilter", "");
//    formdata.append("hearingsortfilter", "");
//    formdata.append("petionerfilter", "");
//    formdata.append("respondentrfilter", "");

//    $('#myOverlaySummary').show();

//    $.ajax({
//        url: '/api/MatterApi/LoadNewCaseList',
//        data: formdata,
//        processData: false,
//        contentType: false,
//        type: 'POST',
//        success: function (response) {
//            $('#myOverlaySummary').hide();
//            let html = "";
//            let parsedData = [];
//            let totRow = 0;

//            if (response.Data && response.Data !== "[]" && response.Data !== "null") {
//                const caseList = JSON.parse(response.Data);
//                caseList.forEach((item, i) => {
//                    const userCaseId = item.UserCaseid || "";
//                    const masterCaseId = item.MasterCaseId || "";

//                    if (userCaseId.trim() !== "" && masterCaseId.trim() !== "") {
//                            parsedData.push(item);

//                            const matterClientId = item.matterclientid;
//                            const masterCaseId = item.MasterCaseId;
//                            let storedCaseIds = JSON.parse(localStorage.getItem("storedCaseIds")) || [];

//                            const exists = storedCaseIds.some(storedItem =>
//                                storedItem.UserCaseid === userCaseId && storedItem.MasterCaseId === masterCaseId
//                            );

//                            if (!exists) {
//                                storedCaseIds.push({
//                                    UserCaseid: userCaseId,
//                                    MasterCaseId: masterCaseId
//                                });
//                                localStorage.setItem("storedCaseIds", JSON.stringify(storedCaseIds));
//                            }

//                            if (i === 0) {
//                                totRow = parseInt(item.totRow || "0");
//                            }

//                                html += `<tr>
//                                            <td>${item.mname || 'Unknown'}</td>
//                                            <td class="casecourtname">
//                                                <div class="iconbox" style="${!item.CourtName ? 'display:none;' : ''}">
//                                                    <img src="/newassets/img/court.svg">
//                                                    ${item.CourtName ? ' ' + item.CourtName : '&nbsp;'}
//                                                </div>
//                                            </td>
//                                            <td class="Court"><span>${item.OtherCourtName || ''}</span></td>
//                                            <td>${item.mtrno || 'N/A'}</td>
//                                            <td>
//                                                <div class="button9" onclick="handleViewOrdersClick(event, '${item.MasterCaseId}', '${item.UserCaseid}', '${item.mname || ''}')">
//                                                    <div class="text-padding">
//                                                        <div class="text">View Orders</div>
//                                                    </div>
//                                                </div>
//                                            </td>
//                                        </tr>`;
//                    }

//                    // Only run pagination after last item
//                    if (i === caseList.length - 1) {
//                        const totdata = item.totRow || "0";
//                        const totpage = Math.ceil(parseInt(totdata) / parseInt(pageSize));

//                        // Show/hide buttons
//                        $('#next').toggle(pageindex < totpage);
//                        $('#prev').toggle(pageindex > 1);

//                        // Update counters
//                        $("#summaryCount").text("(" + totRow + ")");
//                        $("#exportrecords").val(totRow);
//                        $("#pgetdatabypagenum").attr("pageindex", pageindex);

//                        if (isRenderPage === false) {
//                            tatalRecordCount = totpage;
//                            renderPagination(setPageNo, totpage);
//                            isRenderPage = true;
//                        }
//                    }
//                });

//                $('#mtrPaginationSummary').show();
//            } else {
//                html = `<tr><td colspan="4" style="text-align:center;">No data available</td></tr>`;
//                $('#mtrPaginationSummary').hide();
//            }

//            $("#bindcasedataSummary").html(html);
//        },
//        error: function () {
//            $('#mtrPaginationSummary').hide();
//            $('#myOverlaySummary').hide();
//            $("#bindcasedataSummary").html(`<tr><td colspan="4" style="text-align:center;">Error loading data</td></tr>`);
//        }
//    });
//}

//function handleViewOrdersClick(event, masterCaseId, userCaseId, mname) {
//    openPopUpForSummary(masterCaseId, userCaseId, mname);
//}


//function renderOrdersDataChronology(pageindex, searchcolnaame, searchcolvalue) {
//    $("#chronologyCount").text("");
//    $("#bindcasedataChronology").empty();
//    $('#orderSummaryTab').hide();
//    $('#chronologyTab').show();
//    setPageNo = pageindex;
//    isRenderPageChronology = false;
//    const pageSize = 10;

//    const formdata = new FormData();
//    formdata.append("pagenum", EncodeText(pageindex));
//    formdata.append("pagesize", EncodeText(pageSize));

//    // Same filter values as summary
//    formdata.append("odate", "");
//    formdata.append("casename", EncodeText($('#casefiltercasenameChronology').val()));
//    formdata.append("clientname", "");
//    formdata.append("court", EncodeText($('#casefiltercourtChronology').val()));
//    formdata.append("cstatus", "");
//    formdata.append("createdby", "");
//    formdata.append("users", "");
//    formdata.append("companyfilter", "");
//    formdata.append("mattertypefilter", "Litigation");
//    formdata.append("subjecttypefilter", "");
//    formdata.append("casefilternotes", "");
//    formdata.append("casefiltercourtname", "");
//    formdata.append("odateto", "");
//    formdata.append("fillingdate", "");
//    formdata.append("fillingdateto", "");
//    formdata.append("searchcustomcolname", "");
//    formdata.append("searchcustomcolvalue", "");
//    formdata.append("casedisposefilter", "");
//    formdata.append("casefilterCaseDetails", "");
//    formdata.append("casefiltermtrno", EncodeText($('#casefiltermtrnochronology').val()));
//    formdata.append("casefilterInternalno", "");
//    formdata.append("casefiltercnrno", "");
//    formdata.append("caseredirectfilter", "");
//    formdata.append("NextHearingfromd", "");
//    formdata.append("NextHearingtod", "");
//    formdata.append("CourtStatusfiletr", "");
//    formdata.append("casedetailsfilter", "");
//    formdata.append("hearingsortfilter", "");
//    formdata.append("petionerfilter", "");
//    formdata.append("respondentrfilter", "");

//    $('#myOverlaySummary').show();

//    $.ajax({
//        url: '/api/MatterApi/LoadNewCaseList',
//        data: formdata,
//        processData: false,
//        contentType: false,
//        type: 'POST',
//        success: function (response) {
//            $('#myOverlaySummary').hide();
//            let html = "";
//            let parsedData = [];
//            let totRow = 0;

//            if (response.Data && response.Data !== "[]" && response.Data !== "null") {
//                const caseList = JSON.parse(response.Data);

//                caseList.forEach((item, i) => {
//                    const userCaseId = item.UserCaseid || "";
//                    const masterCaseId = item.MasterCaseId || "";

//                    if (userCaseId.trim() !== "" && masterCaseId.trim() !== "") {
//                        parsedData.push(item);

//                        // Store IDs
//                        const storedCaseIds = JSON.parse(localStorage.getItem("storedCaseIds")) || [];
//                        const exists = storedCaseIds.some(storedItem =>
//                            storedItem.UserCaseid === userCaseId && storedItem.MasterCaseId === masterCaseId
//                        );
//                        if (!exists) {
//                            storedCaseIds.push({ UserCaseid: userCaseId, MasterCaseId: masterCaseId });
//                            localStorage.setItem("storedCaseIds", JSON.stringify(storedCaseIds));
//                        }

//                        if (i === 0) {
//                            totRow = parseInt(item.totRow || "0");
//                        }
//                        html += `<tr>
//                                            <td>${item.mname || 'Unknown'}</td>
//                                            <td class="casecourtname">
//                                                <div class="iconbox" style="${!item.CourtName ? 'display:none;' : ''}">
//                                                    <img src="/newassets/img/court.svg">
//                                                    ${item.CourtName ? ' ' + item.CourtName : '&nbsp;'}
//                                                </div>
//                                            </td>
//                                            <td class="Court"><span>${item.OtherCourtName || ''}</span></td>
//                                            <td>${item.mtrno || 'N/A'}</td>
//                                            <td>
//                                                <div class="button9" onclick="openPopUpForChronology(event, '${item.MasterCaseId}', '${item.UserCaseid}', '${item.mname || ''}')">
//                                                    <div class="text-padding">
//                                                        <div class="text">View Orders</div>
//                                                    </div>
//                                                </div>
//                                            </td>
//                                        </tr>`;
//                    }

//                    // Only run pagination after last item
//                    if (i === caseList.length - 1) {
//                        const totdata = item.totRow || "0";
//                        const totpage = Math.ceil(parseInt(totdata) / parseInt(pageSize));

//                        // Show/hide buttons
//                        $('#next').toggle(pageindex < totpage);
//                        $('#prev').toggle(pageindex > 1);

//                        // Update counters
//                        $("#chronologyCount").text("(" + totRow + ")");
//                        $("#exportrecords").val(totRow);
//                        $("#pgetdatabypagenum").attr("pageindex", pageindex);

//                        if (isRenderPageChronology === false) {
//                            tatalRecordCount = totpage;
//                            renderPaginationChronology(setPageNo, totpage);
//                            isRenderPageChronology = true;
//                        }
//                    }
//                });

//                $('#mtrPagination').show();
//            } else {
//                html = `<tr><td colspan="4" style="text-align:center;">No data available</td></tr>`;
//                $('#mtrPagination').hide();
//            }

//            $("#bindcasedataChronology").html(html);
//        },
//        error: function () {
//            $('#mtrPagination').hide();
//            $('#myOverlaySummary').hide();
//            $("#bindcasedataChronology").html(`<tr><td colspan="4" style="text-align:center;">Error loading data</td></tr>`);
//        }
//    });
//}


//let selectedOrderIds = [];
//let selectedOrderDates = [];

//function formatSummaryMarkdown(text) {
//    if (!text) return "";

//    let formatted = text;

//    // Bold **text**
//    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

//    // Italic *text*
//    formatted = formatted.replace(/\*(.*?)\*/g, "<i>$1</i>");

//    // Bullet lists
//    formatted = formatted.replace(/^\*\s+(.*)$/gm, "<li>$1</li>");
//    formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

//    return formatted;
//}
function formatSummaryMarkdown(text) {
    if (!text || typeof text !== "string") {
        return "";
    }

    try {
        // Ensure markdown tables render correctly by forcing a leading newline
        let markdown = "\n" + text.trim();

        // Configure marked for GitHub-style markdown (tables, lists, etc.)
        marked.setOptions({
            gfm: true,        // Enables tables
            breaks: true      // Converts line breaks to <br>
        });

        // Convert markdown → HTML
        let html = marked.parse(markdown);

        return html;
    } catch (err) {
        console.error("Markdown parsing failed:", err);
        return text; // fallback: show raw text instead of breaking UI
    }
}


function openPopUpForSummary() {
    //localStorage.setItem("AIMasterCaseId", masterId);
    //localStorage.setItem("AIUserCaseid", userCaseIdSummary);
    //localStorage.setItem("mnameSummary", mname);
    const masterId = localStorage.getItem("AIMasterCaseId");
    const userCaseIdSummary = localStorage.getItem("AIUserCaseid");
    const mname = localStorage.getItem("mnameSummary");
    $('#orderSummaryModalMatter').empty();
    let matterNameSummary = mname || 'Unknown Matter';
    $('#orderSummaryModal').modal('show');
    $('#orderSummaryModalMatter').append(matterNameSummary);
    $('#myOverlaySummary').show();
    $('#orderChronologyModal').hide();

    const masterCaseID = localStorage.getItem("AIMasterCaseId");

    //const tokencasedata = "Wd2jIRC1lBBZ3/mO5khllQ==";
    const tokencasedata = masterId;
    const caseid = userCaseIdSummary;
    const IsRevenueCourt = 0;
    const IsReraCourt = 0;

    const formData = new FormData();
    formData.append("id", tokencasedata);
    formData.append("caseid", caseid);
    formData.append("IsRevenueCourt", IsRevenueCourt);
    formData.append("IsReraCourt", IsReraCourt);

    // First, fetch the summary details
    $.ajax({
        url: '/Firm/GetSummaryDetails',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            MasterCaseId: masterCaseID,
            UserCaseId: caseid
        }),
        success: function (summaryResponse) {
            $('#myOverlaySummary').hide();

            const historyList = document.getElementById("aiHistoryList");
            const summaryContainer = document.getElementById("summaryLog");
            const noHistoryMessage = document.getElementById("noHistoryMessage");

            historyList.innerHTML = "";
            summaryContainer.innerHTML = "";

            if (!summaryResponse || !summaryResponse.success || summaryResponse.data.length === 0) {
                noHistoryMessage.style.display = "block";
                return;
            }

            noHistoryMessage.style.display = "none";

            const summaries = summaryResponse.data;

            summaries.forEach((item, index) => {
                const div = document.createElement("div");
                div.className = "history-item";
                div.innerText = item.OrderDates || `Entry ${index + 1}`;

                div.addEventListener("click", function () {
                    // remove active class
                    document.querySelectorAll(".history-item")
                        .forEach(i => i.classList.remove("active"));

                    div.classList.add("active");

                    // render summary (contains HTML links already)
                    summaryContainer.innerHTML = `
                <div class="summary-card" id="summaryCardToPrint">
                    <div class="summary-date"><b>Order Dates:</b> ${item.OrderDates}</div>
                    <div class="summary-content">${formatSummaryMarkdown(item.Summary)}</div>
                     <div class="summary-actions" style="margin-top:15px; text-align:right;">
            <button class="btn btn-sm btn-primary" id="printSummaryButton" onclick="printSummaryCard()">Print</button>
            <button class="btn btn-sm btn-success" id="emailSummaryButton"  onclick="openEmailModal()">E-mail</button>
        </div>
                </div>
            `;
                });

                historyList.appendChild(div);
            });

            // auto select first summary
            if (historyList.firstChild) {
                historyList.firstChild.click();
            }

            // update count
        //    $("#summaryResultCount").text(`(${summaries.length})`);
        },
        error: function () {
            $('#myOverlaySummary').hide();
            alert("Failed to load summary details.");
        }
    });
}

function printSummaryCard() {

    const content = document.querySelector(".summary-content").innerHTML;
    const mname = localStorage.getItem("mnameSummary");

    const headerContent = `
        <div style="margin-bottom:20px;">
            <div style="display:flex;align-items:center;margin-bottom:10px;">
                <img src="/newassets/img/logo.png" style="height:60px;margin-right:20px;">
                <h2 style="margin:0;">Summary for Matter: ${mname}</h2>
            </div>
        </div>
    `;
    const disclaimer = `
        <div class="disclaimer">
            Disclaimer: This AI-generated summary is for information only. 
            Refer to the original source for full context and understanding.
        </div>
    `;
    const printWindow = window.open('', '', 'width=900,height=700');

    printWindow.document.write(`
        <html>
            <head>
                <title>Print Summary</title>
                <style>
                    body { 
                        font-family: Arial; 
                        padding:20px;
                    }

                    .summary-date { 
                        margin-bottom:10px; 
                    }

                    img {
                        max-width:150px;
                    }
                    .disclaimer {
                        font-size:12px;
                        color:#888;
                        text-align:center;
                        font-style:italic;
                        margin-top:30px;
                    }
                    @media print {
                        #printSummaryButton,
                        #emailSummaryButton{
                            display:none !important;
                        }

                        body {
                            margin:0;
                        }
                    }
                </style>
            </head>
            <body>

                ${headerContent}

                ${content}

                ${disclaimer}
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 300);
}


function openEmailModal() {
    document.getElementById("recipientEmail").value = "";
    document.getElementById("emailMessage").value = "";
    document.getElementById("emailModalCustomSummary").style.display = "flex";
}

function closeEmailModal() {
    document.getElementById("emailModalCustomSummary").style.display = "none";
}

async function sendEmailModal() {

    const recipient = document.getElementById("recipientEmail").value.trim();
    const userMessage = document.getElementById("emailMessage").value.trim();

    if (!recipient) {
        alert("Recipient email is required.");
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient)) {
        alert("Please enter a valid email address.");
        return;
    }

    try {

        $('#myOverlaySummary').show();

        const container = document.querySelector(".summary-content");
        const filename = "Case_Summary_" + new Date().toISOString().split('T')[0];

        const pdfBlob = await htmlToPDFBlob(container, filename);

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
            Subject: filename,
            Message: userMessage || "Please find attached the case summary.",
            AttachmentBase64: base64Pdf,
            AttachmentFileName: filename + ".pdf"
        };
        const response = await fetch('/Firm/SendOcrEmail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        $('#myOverlaySummary').hide();

        if (response.ok) {
            alert("E-mail has been sent successfully.");
            closeEmailModal();
        } else {
            alert("Failed to send e-mail.");
        }

    } catch (error) {
        $('#myOverlaySummary').hide();
        console.error(error);
        alert("Something went wrong while sending email.");
    }
}
$(document).on("click", "#emailorder", function () {
    var flname = $(this).attr("filename");
    $("#attach").val("Attached document");
    $("#hidftoken").val($(this).attr("ftoken"));
    $("#hidctoken").val($(this).attr("casetoken"));
    $('#test2').modal({
        backdrop: 'static',
        keyboard: false
    });
});
$(document).on("click", "#cemailorder", function () {
    $("#test2").modal('hide');
});
try {
    $("#senddocs").click(function () {
        var formdata1 = new FormData();
        var emailto = $("#emailto").val();
        if (emailto == "") {
            alert("Please enter the E-mail Id.");
            return false;
        }
        else {
            //if (emailto != "") {
            //    var emailArray = emailto.split(",");
            //    for (i = 0; i <= (emailArray.length - 1); i++) {
            //        if (checkEmail(emailArray[i])) {
            //            vEmails = "true";
            //        } else {
            //            vEmails = "false";
            //            new PNotify({
            //                title: 'Warning!',
            //                text: ' Invalid email format!',
            //                type: 'error',
            //                delay: 3000
            //            });
            //        }
            //    }
            //}
            vEmails = "true";
        }
        if (vEmails == "" || vEmails == "true") {
            formdata1.append("email", EncodeText(emailto));
            formdata1.append("casetoken", EncodeText($("#hidctoken").val()));
            formdata1.append("ftoken", EncodeText($("#hidftoken").val()));
            formdata1.append("mailfilename", EncodeText($("#attach").val()));
            formdata1.append("mailbody", EncodeText($("#emailbody").html()));
            formdata1.append("mailsubject", EncodeText($("#emailsubject").val()));
            $.ajax({
                async: true,
                url: '/firm/Sendcaseorderfile',
                data: formdata1,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (response) {
                    new PNotify({
                        title: 'Success!',
                        text: ' Matter order has been sent successfully',
                        type: 'success',
                        delay: 3000
                    });
                    $("#emailto").val("");
                },
                error: function () {
                }
            });
        }
    });
}
catch (er) {
    // alert(er.message);
}
//function viewExistingSummary(masterCaseId, userCaseId, orderId, mname) {
//    $.ajax({
//        url: '/Firm/GetSummaryDetails',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify({
//            MasterCaseId: masterCaseId,
//            UserCaseId: userCaseId
//        }),
//        success: function (response) {
//            if (response && response.success) {
//                let matchedSummary = response.data.find(entry =>
//                    entry.OrderIds && entry.OrderIds.split(',').includes(orderId.toString())
//                )
//                if (matchedSummary) {
//                    const renderedHTML = marked.parse(matchedSummary.Summary || '');
//                    const orderDatesStr = matchedSummary.OrderDates || '';
//                    const createdOnRaw = matchedSummary.CreatedOn || '';
//                    let createdOnFormatted = '';
//                    const match = /\/Date\((\d+)\)\//.exec(createdOnRaw);
//                    if (match) {
//                        const timestamp = parseInt(match[1], 10);
//                        const dateObj = new Date(timestamp);
//                        createdOnFormatted = dateObj.toLocaleString('en-IN', {
//                            day: '2-digit',
//                            month: 'short',
//                            year: 'numeric',
//                            hour: '2-digit',
//                            minute: '2-digit',
//                            hour12: true
//                        });
//                    }
//                    const newTab = window.open('', '_blank');
//                    if (!newTab) {
//                        alert('Popup blocked. Please allow popups for this site.');
//                        return;
//                    }
//                    newTab.document.write(`
//                        <html>
//                        <head>
//                            <title>AI Summary</title>
//                            <style>
//                                body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.6; background: #f9f9f9; }
//                                .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative; }
//                                .disclaimer { font-size: 12px; color: #888; text-align: center; font-style: italic; margin-top: 30px; }
//                                .top-right-controls { position: absolute; top: 20px; right: 20px; display: flex; gap: 10px; }
//                                .top-right-controls img { height: 20px; cursor: pointer; }
//                                .header-title h2 { text-align: center; margin-top: 20px; }
//                                @media print {
//                                    #emailSummaryBtn,
//                                    #printSummaryBtn {
//                                        display: none !important;
//                                    }
//                                }
//                            </style>
//                        </head>
//                        <body>
//                            <div class="container">
//                                <div class="top-right-controls">
//                                    <img id="emailSummaryBtn" src="/newassets/img/mail.svg" alt="Email Summary" title="Email Summary" onclick="">
//                                    <img id="printSummaryBtn" src="/newassets/img/print.png" alt="Print Summary" title="Print Summary" onclick="window.print();">
//                                </div>
                                //<div class="header">
                                //    <img src="/newassets/img/logo.png" alt="Logo">
                                //    <div class="header-title"><h2 style="text-align:center;">Summary for Matter: ${mname}</h2></div>
                                //</div>
                                //<div class="summary-info">
                                //    <p><strong>Orders (Order Dates):</strong> ${orderDatesStr}</p>
                                //    <p><strong>Generated On:</strong> ${createdOnFormatted}</p>
//                                </div>
//                                ${renderedHTML}
//                                <div class="disclaimer">
//                                    Disclaimer: This AI-generated summary is for information only. Refer to the original source for full context and understanding.
//                                </div>
//                            </div>

//                        </body>
//                        </html>
//                    `);
//                    newTab.document.close();
//                } else {
//                    alert("No summary found for this order.");
//                }
//            } else {
//                alert("Failed to retrieve summary.");
//            }
//        },
//        error: function () {
//            alert("Error occurred while fetching summary.");
//        }
//    });
//}

//function OpenOrderNewTab(filePath) {
//    window.open(filePath);
//}

function openPopUpForChronology() {
    const masterId = localStorage.getItem("AIMasterCaseId");
    const userCaseIdSummary = localStorage.getItem("AIUserCaseid");
    const mname = localStorage.getItem("mnameSummary");

    const matterNameSummary = mname || 'Unknown Matter';

    $('#myOverlayChronology').show();
    $('#orderSummaryModal').hide();
    $('#orderChronologyModal').hide();   

    $('#orderChronologyModalMatter').empty().append(matterNameSummary);

    $.ajax({
        url: '/Firm/GetChronologyDetails',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            MasterCaseId: masterId,
            UserCaseId: userCaseIdSummary
        }),
        success: function (chronologyResponse) {
            $('#myOverlayChronology').hide();

            const historyList = document.getElementById("aiHistoryList");
            const chronologyContainer = document.getElementById("chronologyLog");
            const noHistoryMessage = document.getElementById("noHistoryMessage");

            if (!historyList || !chronologyContainer) return;

            historyList.innerHTML = "";
            chronologyContainer.innerHTML = "";

            if (chronologyResponse.success &&
                Array.isArray(chronologyResponse.data) &&
                chronologyResponse.data.length > 0) {

                noHistoryMessage && (noHistoryMessage.style.display = "none");

                const chronologies = chronologyResponse.data;

                chronologies.forEach((item, index) => {

                    const div = document.createElement("div");
                    div.className = "history-item";
                    div.innerText = item.OrderDates || `Entry ${index + 1}`;

                    div.addEventListener("click", function () {
                        document.querySelectorAll("#aiHistoryList .history-item")
                            .forEach(i => i.classList.remove("active"));

                        div.classList.add("active");

                        chronologyContainer.innerHTML = `
                            <div class="summary-card" id="summaryCardToPrint">
                                <div class="summary-date">
                                    <b>Order Dates:</b> ${item.OrderDates || 'N/A'}
                                </div>
                                <div class="summary-content">
                                    ${markdownTableToHtml(item.Chronology)}
                                </div>
                                             <div class="summary-actions" style="margin-top:15px; text-align:right;">
    <button class="btn btn-sm btn-primary" onclick="printSummaryCard()">Print</button>
    <button class="btn btn-sm btn-success" onclick="openEmailModal()">E-mail</button>
</div>
                            </div>
                        `;
                    });

                    historyList.appendChild(div);
                });

                // Auto select first record
                historyList.firstChild.click();

                // Count badge
                //$("#chronologyResultCount").text(`(${chronologies.length})`);

            } else {
                if (noHistoryMessage) noHistoryMessage.style.display = "block";
            }
        },
        error: function () {
            $('#myOverlayChronology').hide();
            $('#chronologyLog').html('<div class="text-danger text-center">Failed to load chronology history.</div>');
        }
    });
}

function markdownTableToHtml(markdown) {
    if (!markdown) return '';

    const lines = markdown.trim().split('\n');

    let html = '<table class="table table-bordered table-sm">';

    lines.forEach((line, index) => {

        // skip separator line like |----|
        if (index === 1 && line.includes('---')) return;

        const cells = line.split('|').filter(c => c.trim() !== '');

        if (index === 0) {
            html += '<thead><tr>';
            cells.forEach(cell => html += `<th>${cell.trim()}</th>`);
            html += '</tr></thead><tbody>';
        } else {
            html += '<tr>';
            cells.forEach(cell => html += `<td>${cell.trim()}</td>`);
            html += '</tr>';
        }
    });

    html += '</tbody></table>';
    return html;
}

//function viewExistingChronology(masterCaseId, userCaseId, orderId, mname) {
//    $.ajax({
//        url: '/Firm/GetChronologyDetails',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify({
//            MasterCaseId: masterCaseId,
//            UserCaseId: userCaseId
//        }),
//        success: function (response) {
//            if (response && response.success) {
//                let matchedChronology = response.data.find(entry =>
//                    entry.OrderIds && entry.OrderIds.split(',').includes(orderId.toString())
//                );

//                if (matchedChronology) {
//                    const renderedHTML = marked.parse(matchedChronology.Chronology || '');

//                    const orderDatesStr = matchedChronology.OrderDates || '';
//                    const createdOnRaw = matchedChronology.CreatedOn || '';
//                    let createdOnFormatted = '';
//                    const match = /\/Date\((\d+)\)\//.exec(createdOnRaw);
//                    if (match) {
//                        const timestamp = parseInt(match[1], 10);
//                        const dateObj = new Date(timestamp);
//                        createdOnFormatted = dateObj.toLocaleString('en-IN', {
//                            day: '2-digit',
//                            month: 'short',
//                            year: 'numeric',
//                            hour: '2-digit',
//                            minute: '2-digit',
//                            hour12: true
//                        });
//                    }

//                    const newTab = window.open('', '_blank');
//                    if (!newTab) {
//                        alert('Popup blocked. Please allow popups for this site.');
//                        return;
//                    }

//                    newTab.document.write(`
//                        <html>
//                        <head>
//                            <title>AI Chronology</title>
//                            <style>
//                                body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.6; background: #f9f9f9; }
//                                .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative; }
//                                .disclaimer { font-size: 12px; color: #888; text-align: center; font-style: italic; margin-top: 30px; }
//                                .top-right-controls { position: absolute; top: 20px; right: 20px; display: flex; gap: 10px; }
//                                .top-right-controls img { height: 20px; cursor: pointer; }
//                                .header-title h2 { text-align: center; margin-top: 20px; }
//                                @media print {
//                                    #emailChronologyBtn,
//                                    #printChronologyBtn {
//                                        display: none !important;
//                                    }
//                                }
//                            </style>
//                        </head>
//                        <body>
//                            <div class="container">
//                                <div class="top-right-controls">
//                                    <img id="emailChronologyBtn" src="/newassets/img/mail.svg" alt="Email Chronology" title="Email Chronology" onclick="">
//                                    <img id="printChronologyBtn" src="/newassets/img/print.png" alt="Print Chronology" title="Print Chronology" onclick="window.print();">
//                                </div>
//                                <div class="header">
//                                    <img src="/newassets/img/logo.png" alt="Logo">
//                                    <div class="header-title"><h2 style="text-align:center;">Chronology for Matter: ${mname}</h2></div>
//                                </div>
//                                <div class="chronology-info">
//                                    <p><strong>Orders (Order Dates):</strong> ${orderDatesStr}</p>
//                                    <p><strong>Generated On:</strong> ${createdOnFormatted}</p>
//                                </div>
//                                ${renderedHTML}
//                                <div class="disclaimer">
//                                    Disclaimer: This AI-generated chronology is for informational purposes only. Please verify from original court records.
//                                </div>
//                            </div>
//                        </body>
//                        </html>
//                    `);
//                    newTab.document.close();
//                } else {
//                    alert("No chronology found for this order.");
//                }
//            } else {
//                alert("Failed to retrieve chronology.");
//            }
//        },
//        error: function () {
//            alert("Error occurred while fetching chronology.");
//        }
//    });
//}

//$(document).ready(function () {
//    $('#cancelSummaryModalBtn').on('click', function () {
//        console.log("User canceled summary generation.");
//        $('#confirmDeleteSummaryModal').modal('hide');
//    });
//});

//$(document).ready(function () {
//    $('#cancelChronologyModalBtn').on('click', function () {
//        console.log("User canceled ChronologyM generation.");
//        $('#confirmDeleteChronologyModal').modal('hide');
//    });
//});

$(document).ready(function () {
    let selectedUrls = [];
    let selectedOrderIds = [];
    let selectedOrderDates = [];

    // Enable/disable button based on checkbox selection
    $(document).on('change', '.order-checkbox', function () {
        $('#generateSummaryButton').prop('disabled', true);
        const checkedBoxes = $('.order-checkbox:checked');
        const checkedCount = checkedBoxes.length;

        selectedOrderIds = [];
        selectedOrderDates = [];

        // Enforce max 5 selection
        //if (checkedCount > 5) {
        //    alert("You can select a maximum of 5 orders at a time.");
        //    this.checked = false;
        //    return;
        //}

        checkedBoxes.each(function () {
            const orderId = $(this).data('orderid');
            const orderDate = $(this).closest('tr').find('td:nth-child(2)').text().trim().split('\n')[0];
            if (orderId) {
                selectedOrderIds.push(orderId);
            }
            if (orderDate) {
                selectedOrderDates.push(orderDate);
            }
        });

        $('#generateSummaryButton').prop('disabled', checkedCount === 0);
    });

    // On click of Generate Summary button - show confirmation modal
    $('#generateSummaryButton').on('click', async function () {
        selectedUrls = [];
        GetAIToolsQuota();
        if (TotalUsedQuota >= totalQuotaAITools) {
            alert("Your AI Tools quota has been exhausted.");
            return;
        }
        let MKDrivePathAITools = localStorage.getItem("pathAITools");

        if (MKDrivePathAITools) {
            selectedUrls.push(MKDrivePathAITools);
        }
        else if (!MKDrivePathAITools || MKDrivePathAITools.trim() === "") {
            $('.order-checkbox:checked').each(function () {
                const url = $(this).data('vlocalfile');
                if (url) {
                    selectedUrls.push(url);
                }
            });
        }
        else {
            $('.order-checkbox:checked').each(function () {
                const url = $(this).data('vlocalfile');
                if (url) {
                    selectedUrls.push(url);
                }
            });
        }

        if (selectedUrls.length === 0) {
            alert("Please select at least one order.");
            return;
        }
        $('#confirmDeleteSummaryModal').modal('hide');

        //Update Credits
        const response = await $.ajax({
            url: '/Firm/GetTotalPdfPages',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(selectedUrls)
        });

        $(".loading").hide();

        if (!response.success) {
            alert(response.message || "Something went wrong");
            $('#myOverlaySummary').hide();
            return;
        }

        const totalPages = response.totalPages || 0;
        const quota = totalPages * 2;

        if (TotalUsedQuota + quota >= totalQuotaAITools) {
            alert("Your AI Tools quota is not sufficient to process this request.");
            $('#myOverlaySummary').hide();
            return;
        }

        console.log("Total Pages:", totalPages);
        console.log("Quota:", quota);

        InsertAIToolsQuota(totalQuotaAITools, quota, "Generate Summary");


        $('#myOverlaySummary').show();
        const payload = JSON.stringify({
            urls: selectedUrls
        });
        //const hasHtml = selectedUrls.some(url => url.toLowerCase().endsWith('.html'));
        const hasHtml = selectedUrls.some(url =>
            /\.(html?|HTML?)$/.test(url)
        );

        if (hasHtml) {
            $.ajax({
                url: '/Firm/UploadOrderFiles',
                type: 'POST',
                contentType: 'application/json',
                data: payload,
                success: function (response, textStatus, xhr) {
                    if (xhr.status === 200) {
                        let data;
                        if (typeof response === "string") {
                            try {
                                data = JSON.parse(response);
                            } catch (e) {
                                console.error(e);
                                return;
                            }
                        } else {
                            data = response;
                        }

                        if (data.job_id) {
                            console.log("Job ID:", data.job_id);
                            $('#myOverlaySummary').show();
                            setTimeout(function () {
                                $('#orderSummaryModal').modal('hide');
                                getAIOrderSummary(data.job_id, selectedOrderIds ||"", selectedOrderDates||"", payload);
                            }, 100);
                        } else {
                            console.error("Response missing job_id.");
                        }
                    } else {
                        console.error("Unexpected response status: " + xhr.status);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Upload failed:", error);
                }
            });
        }
        else {
            $.ajax({
                url: '/Firm/UploadOrderUrls',
                type: 'POST',
                contentType: 'application/json',
                data: payload,
                success: function (response, textStatus, xhr) {
                    if (xhr.status === 200) {
                        let data;
                        if (typeof response === "string") {
                            try {
                                data = JSON.parse(response);
                            } catch (e) {
                                console.error(e);
                                return;
                            }
                        } else {
                            data = response;
                        }

                        if (data.job_id) {
                            console.log("Job ID:", data.job_id);
                            $('#myOverlaySummary').show();
                            setTimeout(function () {
                                $('#orderSummaryModal').modal('hide');
                                getAIOrderSummary(data.job_id, selectedOrderIds || "", selectedOrderDates || "", payload);
                            }, 100);
                        } else {
                            console.error("Response missing job_id.");
                        }
                    } else {
                        console.error("Unexpected response status: " + xhr.status);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Upload failed:", error);
                }
            });
        }

    });

    // When OK is clicked in the modal, proceed with summary generation
    $('#confirmGenerateSummaryBtn').on('click', function () {
        $('#confirmDeleteSummaryModal').modal('hide');
        $('#myOverlaySummary').show();
        const payload = JSON.stringify({
            urls: selectedUrls
        });
        //const hasHtml = selectedUrls.some(url => url.toLowerCase().endsWith('.html'));
        const hasHtml = selectedUrls.some(url =>
            /\.(html?|HTML?)$/.test(url)
        );

        if (hasHtml) {
            $.ajax({
                url: '/Firm/UploadOrderFiles',
                type: 'POST',
                contentType: 'application/json',
                data: payload,
                success: function (response, textStatus, xhr) {
                    if (xhr.status === 200) {
                        let data;
                        if (typeof response === "string") {
                            try {
                                data = JSON.parse(response);
                            } catch (e) {
                                console.error(e);
                                return;
                            }
                        } else {
                            data = response;
                        }

                        if (data.job_id) {
                            console.log("Job ID:", data.job_id);
                            $('#myOverlaySummary').show();
                            setTimeout(function () {
                                $('#orderSummaryModal').modal('hide');
                                getAIOrderSummary(data.job_id, selectedOrderIds, selectedOrderDates, payload);
                            }, 100);
                        } else {
                            console.error("Response missing job_id.");
                        }
                    } else {
                        console.error("Unexpected response status: " + xhr.status);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Upload failed:", error);
                }
            });
        }
        else {
            $.ajax({
                url: '/Firm/UploadOrderUrls',
                type: 'POST',
                contentType: 'application/json',
                data: payload,
                success: function (response, textStatus, xhr) {
                    if (xhr.status === 200) {
                        let data;
                        if (typeof response === "string") {
                            try {
                                data = JSON.parse(response);
                            } catch (e) {
                                console.error(e);
                                return;
                            }
                        } else {
                            data = response;
                        }

                        if (data.job_id) {
                            console.log("Job ID:", data.job_id);
                            $('#myOverlaySummary').show();
                            setTimeout(function () {
                                $('#orderSummaryModal').modal('hide');
                                getAIOrderSummary(data.job_id, selectedOrderIds, selectedOrderDates, payload);
                            }, 100);
                        } else {
                            console.error("Response missing job_id.");
                        }
                    } else {
                        console.error("Unexpected response status: " + xhr.status);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Upload failed:", error);
                }
            });
        }

    });
});

// Code to show Summary in a new tab
function getAIOrderSummary(job_id, selectedOrderIds, selectedOrderDates, payload) {

    let matterNameSummary = localStorage.getItem("mnameSummary") || "Unknown Matter";
    let MKDrivePathAITools = localStorage.getItem("pathAITools");
    const fileNameSummary = MKDrivePathAITools?.split('/').pop() || "";
    let orderDatesSummary =
        (selectedOrderDates && selectedOrderDates.length > 0)
            ? [...new Set(selectedOrderDates)].join(",")
            : (fileNameSummary || "No Order Dates");

    let urls = [];
    try {
        const parsedPayload = JSON.parse(payload);
        urls = parsedPayload.urls || [];
    } catch (e) {
        console.error("Invalid payload format", e);
    }

    $('#myOverlaySummary').show();

    getSummaryWhenReady(job_id, 6000, 20)
        .then(data => {

            if (!data || !data.summary) {
                $("#aiResultContent").html("<p>No summary available for this order.</p>");
                return;
            }

            let summaryText = data.summary;
            summaryText = summaryText.replace(/\[source_(\d+)\]/g, function (_, num) {
                const index = parseInt(num, 10) - 1;
                const filePath = urls.length ? urls[Math.min(index, urls.length - 1)] : null;

                return filePath
                    ? `<sup><a href="${filePath}" target="_blank">${num}</a></sup>`
                    : `<sup>${num}</sup>`;
            });

            summaryText = summaryText.replace(/<\/sup>\s*<sup>/g, "</sup> <sup>");

            const renderedHTML = marked.parse(summaryText);

            // 🔥 SHOW RESULT IN UI
            $("#aiResultContent").html(renderedHTML);
            $("#aiResultContainer").show();
            $("#aiResultContainer")[0].scrollIntoView({ behavior: "smooth" });
            $("#titleAITools").hide();
            $(".ai-tools-grid").css({
                "display": "flex",
                "gap": "10px",
                "justify-content": "flex-start",
                "align-items": "center",
                "font-size": "12px",
                "margin-top": "10px"
            });
            // 💾 SAVE SUMMARY
            const userCaseId = localStorage.getItem("AIUserCaseid") || "";
            const masterCaseId = localStorage.getItem("AIMasterCaseId") || "";

            if (userCaseId && masterCaseId) {
                $.ajax({
                    url: "/Firm/SaveSummaryDetails",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        JobId: job_id,
                        UserCaseId: userCaseId,
                        MasterCaseId: masterCaseId,
                        MatterName: matterNameSummary,
                        Summary: summaryText,
                        OrderIds: (typeof selectedOrderIds !== "undefined" && selectedOrderIds?.length) ? selectedOrderIds.join(",") : (MKDrivePathAITools || ""),
                        OrderDates: orderDatesSummary,
                        CreatedOn: new Date().toISOString()
                    })
                });
            }
        })
        .catch(err => {
            console.error(err);
            $("#aiResultContent").html("<p>No summary available for this order.</p>");
        })
        .finally(() => {
            $('#myOverlaySummary').hide();
        });
}


function getSummaryWhenReady(job_id, interval = 3000, maxAttempts = 20) {
    return new Promise((resolve, reject) => {
        let attempts = 0;

        function poll() {
            $.ajax({
                url: '/Firm/SummaryStatus',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ job_id: job_id }),
                success: function (response) {
                    let data;
                    if (typeof response === "string") {
                        try {
                            data = JSON.parse(response);
                        } catch (e) {
                            reject("Failed to parse summary response.");
                            return;
                        }
                    } else {
                        data = response;
                    }
                    if (data.status && data.status.toLowerCase() === "completed") {
                        resolve(data);
                    } else {
                        attempts++;
                        if (attempts < maxAttempts) {
                            setTimeout(poll, interval);
                        } else {
                            reject("Polling timed out after " + maxAttempts + " attempts.");
                        }
                    }
                },
                error: function (xhr, status, error) {
                    reject("Error polling summary: " + error);
                }
            });
        }

        poll();
    });
}

$(document).on("click", ".ai-top-tabs .tab-item", function () {
    const view = $(this).data("view");

    $(".ai-top-tabs .tab-item").removeClass("active");
    $(this).addClass("active");

    $(".ai-view").removeClass("active");

    if (view === "tools") {
        $("#aiToolsView").addClass("active");
    } else {
        $("#aiHistoryView").addClass("active");
    }
});

$(document).ready(function () {
    let selectedUrls = [];
    let selectedOrderIds = [];
    let selectedOrderDates = [];

    // Enable/disable button based on checkbox selection and enforce max 5
    $(document).on('change', '.order-checkbox', function () {
        $('#generateChronologyButton').prop('disabled', true);
        const checkedBoxes = $('.order-checkbox:checked');
        const checkedCount = checkedBoxes.length;


        selectedOrderIds = [];
        selectedOrderDates = [];

        //if (checkedCount > 5) {
        //    alert("You can select a maximum of 5 orders at a time.");
        //    this.checked = false;
        //    return;
        //}

        checkedBoxes.each(function () {
            const orderId = $(this).data('orderid');
            const orderDate = $(this).closest('tr').find('td:nth-child(2)').text().trim().split('\n')[0];
            if (orderId) {
                selectedOrderIds.push(orderId);
            }
            if (orderDate) {
                selectedOrderDates.push(orderDate);
            }
        });

        $('#generateChronologyButton').prop('disabled', checkedCount === 0);
    });

    // Show confirmation modal on Generate Chronology click
    $('#generateChronologyButton').on('click', async function () {
        selectedUrls = [];
        GetAIToolsQuota();
        if (TotalUsedQuota >= totalQuotaAITools) {
            alert("Your AI Tools quota has been exhausted.");
            return;
        }
        let MKDrivePathAITools = localStorage.getItem("pathAITools");

        if (MKDrivePathAITools) {
            selectedUrls.push(MKDrivePathAITools);
        }
        else if (!MKDrivePathAITools || MKDrivePathAITools.trim() === "") {

            $('.order-checkbox:checked').each(function () {
                const url = $(this).data('vlocalfile');
                if (url) {
                    selectedUrls.push(url);
                }
            });
        }
        else {
            $('.order-checkbox:checked').each(function () {
                const url = $(this).data('vlocalfile');
                if (url) {
                    selectedUrls.push(url);
                }
            });
        }

        if (selectedUrls.length === 0) {
            alert("Please select at least one order.");
            return;
        }
        $('#confirmDeleteChronologyModal').modal('hide');

        //Update Credits
        const response = await $.ajax({
            url: '/Firm/GetTotalPdfPages',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(selectedUrls)
        });

        $(".loading").hide();

        if (!response.success) {
            alert(response.message || "Something went wrong");
            $('#myOverlaySummary').hide();
            return;
        }

        const totalPages = response.totalPages || 0;
        const quota = totalPages * 5;

        if (TotalUsedQuota + quota >= totalQuotaAITools) {
            alert("Your AI Tools quota is not sufficient to process this request.");
            $('#myOverlaySummary').hide();
            return;
        }

        console.log("Total Pages:", totalPages);
        console.log("Quota:", quota);

        InsertAIToolsQuota(totalQuotaAITools, quota, "Generate Chronology");

        $('#myOverlayChronology').show();
        const payload = JSON.stringify({ urls: selectedUrls });
        //const hasHtml = selectedUrls.some(url => url.toLowerCase().endsWith('.html'));
        const hasHtml = selectedUrls.some(url =>
            /\.(html?|HTML?)$/.test(url)
        );
        $.ajax({
            url: '/Firm/UploadOrderUrlsChronology',
            type: 'POST',
            contentType: 'application/json',
            data: payload,
            success: function (response, textStatus, xhr) {
                if (xhr.status === 200) {
                    let data;
                    try {
                        data = typeof response === "string" ? JSON.parse(response) : response;
                    } catch (e) {
                        console.error("Error parsing response:", e);
                        return;
                    }

                    if (data.job_id) {
                        localStorage.setItem('generatedChronologyOrderIds', JSON.stringify(selectedOrderIds));
                        localStorage.setItem('latestChronologyJobId', data.job_id);

                        $('#myOverlayChronology').show();
                        setTimeout(function () {
                            $('#orderChronologyModal').modal('hide');
                            getAIOrderChronology(data.job_id, selectedOrderIds, selectedOrderDates, payload);
                        }, 100);
                    } else {
                        console.error("Response missing job_id.");
                    }
                } else {
                    console.error("Unexpected response status: " + xhr.status);
                }
            },
            error: function (xhr, status, error) {
                console.error("Upload failed:", error);
            }
        });
    });

    // On confirm, call API and store selected order IDs and latest job_id
    $('#confirmGenerateChronologyBtn').on('click', function () {
        $('#confirmDeleteChronologyModal').modal('hide');
        $('#myOverlayChronology').show();
        const payload = JSON.stringify({ urls: selectedUrls });
        //const hasHtml = selectedUrls.some(url => url.toLowerCase().endsWith('.html'));
        const hasHtml = selectedUrls.some(url =>
            /\.(html?|HTML?)$/.test(url)
        );
        $.ajax({
            url: '/Firm/UploadOrderUrlsChronology',
            type: 'POST',
            contentType: 'application/json',
            data: payload,
            success: function (response, textStatus, xhr) {
                if (xhr.status === 200) {
                    let data;
                    try {
                        data = typeof response === "string" ? JSON.parse(response) : response;
                    } catch (e) {
                        console.error("Error parsing response:", e);
                        return;
                    }

                    if (data.job_id) {
                        localStorage.setItem('generatedChronologyOrderIds', JSON.stringify(selectedOrderIds));
                        localStorage.setItem('latestChronologyJobId', data.job_id);

                        $('#myOverlayChronology').show();
                        setTimeout(function () {
                            $('#orderChronologyModal').modal('hide');
                            getAIOrderChronology(data.job_id, selectedOrderIds, selectedOrderDates, payload);
                        }, 100);
                    } else {
                        console.error("Response missing job_id.");
                    }
                } else {
                    console.error("Unexpected response status: " + xhr.status);
                }
            },
            error: function (xhr, status, error) {
                console.error("Upload failed:", error);
            }
        });
    });
});


// Code to show Chronology in a container below the table
function getAIOrderChronology(job_id, orderIds, selectedOrderDates = [], payload) {
    let matterNameSummary = localStorage.getItem("mnameSummary") || 'Unknown Matter';

    let MKDrivePathAITools = localStorage.getItem("pathAITools");
    const fileNameChronology = MKDrivePathAITools?.split('/').pop() || "";
    let orderDatesSummary =
        (selectedOrderDates && selectedOrderDates.length > 0)
            ? [...new Set(selectedOrderDates)].join(",")
            : (fileNameChronology || "No Order Dates");

    let urls = [];
    try {
        const parsedPayload = JSON.parse(payload);
        urls = parsedPayload.urls || [];
    } catch (e) {
        console.error("Invalid payload format", e);
    }

    getChronologyWhenReady(job_id, 3000, 20)
        .then(data => {
            if (data.timeline && data.chunk_map) {
                let timelineText = "\n" + data.timeline;  
                //let timelineText = data.timeline;
                const chunkMap = data.chunk_map;

                timelineText = timelineText.replace(/\[source_(\d+)\]/g, function (_, num) {
                    const index = parseInt(num, 10) - 1;
                    let filePath = null;
                    if (urls.length > 0) {
                        filePath = urls[Math.min(index, urls.length - 1)];
                    }
                    return filePath
                        ? `<sup><a href="${filePath}" target="_blank">${num}</a></sup>`
                        : `<sup>${num}</sup>`;
                });
                timelineText = timelineText.replace(/<\/sup>\s*<sup>/g, '</sup> <sup>');
                //marked.setOptions({ gfm: true });
                marked.setOptions({ gfm: true, breaks: true });

                //const newTab = window.open('', '_blank');
                //if (!newTab) {
                //    alert('Popup blocked. Please allow popups for this site.');
                //    return;
                //}

                const renderedHTML = marked.parse(timelineText);
                const userCaseId = localStorage.getItem("AIUserCaseid");
                const masterCaseId = localStorage.getItem("AIMasterCaseId");

                const remarksSection = `
                        <div id="remarksSection" style="margin-top: 20px;">
                            <label for="chronologyRemarks"><strong>Remarks:</strong></label><br/>
                            <textarea id="chronologyRemarks" rows="3" style="width: 100%;height: 80px !important;padding: 10px !important;border: 1px solid #ccc !important;border-radius: 4px !important;resize: vertical;color: black !important;"></textarea>
                            <button id="saveRemarksBtn" class="btn btn-sm btn-success" style="margin-top: 10px;">Save Remarks</button>
                        </div>`;

                // 🔥 SHOW RESULT IN UI
                $("#aiResultContent").html(renderedHTML);
                $("#aiResultContainer").show();
                $("#aiResultContainer")[0].scrollIntoView({ behavior: "smooth" });
                $("#titleAITools").hide();
                $(".ai-tools-grid").css({
                    "display": "flex",
                    "gap": "10px",
                    "justify-content": "flex-start",
                    "align-items": "center",
                    "font-size": "12px",
                    "margin-top": "10px"
                });
                //newTab.document.open();
                //newTab.document.write(`
                //        <html>
                //        <head>
                //            <title>AI Chronology</title>
                            //<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
                            //<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
                //            <style>
                //                body {
                //                    font-family: Arial, sans-serif;
                //                    padding: 30px;
                //                    background: #f9f9f9;
                //                    margin: 0;
                //                }
                //                .container {
                //                    max-width: 800px;
                //                    margin: 40px auto;
                //                    background: white;
                //                    padding: 30px;
                //                    border-radius: 8px;
                //                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                //                    position: relative;
                //                }
                //                .top-header {
                //                    display: flex;
                //                    justify-content: space-between;
                //                    align-items: center;
                //                    margin-bottom: 20px;
                //                }
                //                .top-header img.logo {
                //                    height: 40px;
                //                }
                //                .top-header .icons img {
                //                    height: 20px;
                //                    margin-left: 15px;
                //                    cursor: pointer;
                //                }
                //                h2 {
                //                    text-align: center;
                //                }
                //                .disclaimer {
                //                    font-size: 12px;
                //                    color: #888;
                //                    text-align: center;
                //                    font-style: italic;
                //                    margin-top: 30px;
                //                }
                //                textarea {
                //                    font-family: Arial;
                //                    font-size: 14px;
                //                }
                //                @media print {
                //                    #emailChronologyBtn,
                //                    #printChronologyBtn {
                //                        display: none !important;
                //                    }
                //                }
                //            </style>
                //        </head>
                //        <body>
                //            <div class="container">
                //                <div class="top-header">
                //                    <img src="/newassets/img/logo.png" alt="Logo" class="logo">
                //                    <div class="icons">
                //                        <img id="emailChronologyBtn" src="/newassets/img/mail.svg" alt="Email Chronology" title="Email Chronology" onclick="">
                //                        <img id="printChronologyBtn" src="/newassets/img/print.png" alt="Print Chronology" title="Print Chronology" onclick="window.print();">
                //                    </div>
                //                </div>
                //                <h2>Chronology for Matter: ${matterNameSummary}</h2>
                //                <p><strong>Orders (Order Dates):</strong> ${orderDatesSummary}</p>
                //                <div id="aiChronologyContent">${renderedHTML}</div>
                //                <div class="disclaimer">
                //                    Disclaimer: This AI-generated chronology is for informational purposes only. Please refer to original documents for complete details.
                //                </div>
                //            </div>
                //             <!-- Injected Email Modal -->
                //            <div id="emailModalCustomChronology" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;justify-content: center;align-items: center;">
                //                <div id="emailModalBox" style="background:#fff;border-radius:8px;width:400px;max-width:90%;max-height:90%;overflow-y:auto;box-shadow:0 5px 15px rgba(0,0,0,0.3);position:relative;">
                //                    <div id="emailModalHeader" style="background-color: #0d6efd; color: white; padding: 12px; font-weight: bold; display: flex ; justify-content: space-between; align-items: center;">
                //                        <h5 id="emailModalTitle" style="font-size:16px;margin:0;"><i class="bi bi-envelope-fill me-2"></i> Send Chronology via Email</h5>
                //                        <button id="emailModalCloseBtn" onclick="closeEmailModal()" aria-label="Close" style="background:transparent;border:none;font-size:20px;cursor:pointer;color: white;">×</button>
                //                    </div>
                //                    <div id="emailModalBody" style=" padding: 20px; "><form id="emailFormCustom" novalidate>
                //                        <div style="margin-bottom:15px;">
                //                            <label for="recipientEmail" style="font-weight:600;font-weight:600;color: #414651;font-size: 14px;">Recipient Email <span style="color:red;">*</span></label>
                //                            <input type="email" id="recipientEmail" placeholder="example@domain.com" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;">
                //                        </div>
                //                        <div style="margin-bottom:15px;">
                //                            <label for="emailMessage" style="font-weight:600;font-weight:600;color: #414651;font-size: 14px;">Message</label>
                //                            <textarea id="emailMessage" rows="4" placeholder="Add a short message (optional)..." style="height: 100px !important; width: 100%; padding: 8px !important; border: 1px solid #ccc !important; border-radius: 4px !important;background: #fafafa !important;"></textarea>
                //                        </div>
                //                    </form></div>
                //                    <div id="emailModalFooter" style="padding: 15px 20px; display: flex ; justify-content: space-between; background: #f5f5f5;;">
                //                        <button id="emailCancelBtn" onclick="closeEmailModal()" style="background-color: transparent; border: 1px solid #6c757d; color: #6c757d; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;"><i class="bi bi-x-circle me-1"></i> Cancel</button>
                //                        <button id="emailSendBtn" onclick="sendEmailModal()" style="background-color: #28a745; border: none; color: white; padding: 8px 24px; border-radius: 4px; cursor: pointer; font-weight: 600;"><i class="bi bi-send-fill me-1"></i> Send</button>
                //                    </div>
                //                </div>
                //            </div>
                //            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                //             <script>
                //                 // Show email modal when clicking the envelope icon
                //                 $('#emailChronologyBtn').on('click', function() {
                //                     $('#emailModalCustomChronology').show();
                //                     $('#emailModalCustomChronology').css('display', 'flex');
                //                     });
                //                     $('#emailModalCloseBtn').on('click', function() {
                //                         $('#emailModalCustomChronology').css('display', 'none');
                //                 });

                //                 function closeEmailModal() {
                //                     $('#emailModalCustomChronology').fadeOut();
                //                 }
                //                     async function sendEmailModal(mname) {
                //                         const recipient = document.getElementById("recipientEmail").value.trim();
                //                         const userMessage = document.getElementById("emailMessage").value.trim();

                //                         if (!recipient) {
                //                             alert("Please enter a recipient email.");
                //                             return;
                //                         }
                //                         $('#myOverlayChronology').show();
                //                         const container = document.querySelector(".container");
                //                         if (!container) {
                //                             alert("Could not find summary container.");
                //                             return;
                //                         }
                //                         let filename = mname;
                //                             if (!filename) {
                //                                 const h2 = container.querySelector("h2");
                //                                 filename = h2 ? h2.textContent.trim().replace(/\s+/g, "_") : "document";
                //                             }

                //                         try {
                //                             const emailIcon = document.getElementById("emailChronologyBtn");
                //                                const printIcon = document.getElementById("printChronologyBtn");
                //                                if (emailIcon) emailIcon.style.display = "none";
                //                                if (printIcon) printIcon.style.display = "none";
                //                             const pdfBlob = await htmlToPDFBlob(container, filename);

                //                             // Convert Blob → Base64
                //                             const base64Pdf = await new Promise((resolve, reject) => {
                //                                 const reader = new FileReader();
                //                                 reader.onloadend = () => {
                //                                     const base64data = reader.result.split(',')[1];
                //                                     resolve(base64data);
                //                                 };
                //                                 reader.onerror = (err) => {
                //                                     reject(err);
                //                                 };
                //                                 reader.readAsDataURL(pdfBlob);
                //                             });
                //                             // Build payload
                //                                 const payload = {
                //                                     To: recipient,
                //                                     Subject: filename,
                //                                     Message: userMessage,
                //                                     AttachmentBase64: base64Pdf,
                //                                     AttachmentFileName: filename + ".pdf"
                //                                 };
                //                             const response = await fetch('/Firm/SendOcrEmail', {
                //                                 method: 'POST',
                //                                 headers: { 'Content-Type': 'application/json' },
                //                                 body: JSON.stringify(payload),
                //                             });
                //                             $('#myOverlayChronology').hide();

                //                             if (response.ok) {
                //                                 alert("E-mail has been sent successfully.");
                //                                 document.getElementById("recipientEmail").value = "";
                //                                 document.getElementById("emailMessage").value = "";

                //                                if (emailIcon) emailIcon.style.display = "";
                //                                if (printIcon) printIcon.style.display = "";
                //                                 closeEmailModal();
                //                             } else {
                //                                 $('#myOverlayChronology').hide();
                //                                 alert("There was an error while sending the e-mail. Please try again.");
                //                             }
                //                         } catch (error) {
                //                             $('#myOverlayChronology').hide();
                //                         }
                //                     finally {
                //                        if (emailIcon) emailIcon.style.display = "";
                //                        if (printIcon) printIcon.style.display = "";
                //                        $('#myOverlaySummary').hide();
                //                    }

                //                     }
                //                     function htmlToPDFBlob(element, fileName) {
                //                         return new Promise((resolve, reject) => {
                //                             const options = {
                //                                 margin: 0.5,
                //                                 filename: fileName + ".pdf",
                //                                 image: { type: 'jpeg', quality: 0.98 },
                //                                 html2canvas: { scale: 2, logging: true }, // enable html2canvas logging
                //                                 jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                //                             };
                //                             try {
                //                                 html2pdf()
                //                                     .set(options)
                //                                     .from(element)
                //                                     .toPdf()
                //                                     .get('pdf')
                //                                     .then(pdf => {
                //                                         const blob = pdf.output('blob');
                //                                         resolve(blob);
                //                                     });
                //                             } catch (err) {
                //                                 reject(err);
                //                             }
                //                         });
                //                     }
                //             </script>
                //        </body>
                //        </html>
                //    `);
                //newTab.document.close();
                $('#myOverlayChronology').hide();
                // Save chronology content
                $.ajax({
                    url: '/Firm/SaveChronologyRemarks',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        JobId: job_id,
                        UserCaseId: userCaseId,
                        MasterCaseId: masterCaseId,
                        OrderIds: (typeof orderIds !== "undefined" && orderIds?.length) ? orderIds.join(",") : (MKDrivePathAITools || ""),
                        OrderDates: orderDatesSummary,
                        Chronology: timelineText,
                        Remarks: null,
                        Action: "INSERT"
                    })
                });
            } else {
                newTab.document.body.innerHTML = "<p>No chronology available for this job.</p>";
            }
        })
        .catch(err => {
            console.error(err);
            newTab.document.body.innerHTML = "<p>No chronology available for this job.</p>";
        });
}
function htmlToPDFBlob(element, fileName) {
    return new Promise((resolve, reject) => {
        const options = {
            margin: 0.5,
            filename: fileName + ".pdf",
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true }, // enable html2canvas logging
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        try {
            html2pdf()
                .set(options)
                .from(element)
                .toPdf()
                .get('pdf')
                .then(pdf => {
                    const blob = pdf.output('blob');
                    resolve(blob);
                });
        } catch (err) {
            reject(err);
        }
    });
}
function getChronologyWhenReady(job_id, interval = 3000, maxAttempts = 20) {
    return new Promise((resolve, reject) => {
        let attempts = 0;

        function poll() {
            $.ajax({
                url: '/Firm/ChronologyStatus',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ job_id: job_id }),
                success: function (response) {
                    let data;
                    if (typeof response === "string") {
                        try {
                            data = JSON.parse(response);
                        } catch (e) {
                            reject("Failed to parse chronology response.");
                            return;
                        }
                    } else {
                        data = response;
                    }
                    if (data.status && data.status.toLowerCase() === "completed") {
                        resolve(data);
                    } else {
                        attempts++;
                        if (attempts < maxAttempts) {
                            setTimeout(poll, interval);
                        } else {
                            reject("Polling chronology timed out after " + maxAttempts + " attempts.");
                        }
                    }
                },
                error: function (xhr, status, error) {
                    reject("Error polling chronology: " + error);
                }
            });
        }

        poll();
    });
}

///*Pagination Start*/
//var isRenderPage = false;
//var totalPageRec = "";
//function renderPagination(pageindex, totdata) {
//    let totPages = totdata;
//    setPageNo = pageindex;
//    totalPageRec = totdata;
//    let paginationHtml = '';
//    let maxVisible = 4; // Visible page numbers before ellipsis

//    if (totPages <= maxVisible + 2) {
//        // Few pages only → show all
//        for (let i = 1; i <= totPages; i++) {
//            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//        }
//    } else {
//        if (pageindex <= maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - (maxVisible - 1); j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        } else if (pageindex > totPages - maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - (maxVisible - 1); j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        } else {
//            paginationHtml += `<button class="page-btn" data-page="1">1</button>`;
//            paginationHtml += `<span>.......</span>`;

//            let start = Math.max(2, pageindex - 1);
//            let end = Math.min(totPages - 1, pageindex + 1);
//            for (let i = start; i <= end; i++) {
//                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }

//            paginationHtml += `<span>.......</span>`;
//            paginationHtml += `<button class="page-btn" data-page="${totPages}">${totPages}</button>`;
//        }
//    }

//    $("#pageNumbers").html(paginationHtml);
//    $("#prev").toggleClass("disabled", pageindex === 1);
//    $("#next").toggleClass("disabled", pageindex === totPages);
//    isRenderPage = true;
//}



//$(document).on("click", ".page-btn", function () {
//    let page = $(this).data("page");
//    setPageNo = page;
//    //if (page) changePage(page);
//    loadflag = true;
//    isRenderPage = true;
//    $("#txtgopage").val("");
//    renderOrdersDataSummary(setPageNo, "", "");
//    $(".page-btn ").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//});

//$("#prev").click(function () {

//    if (setPageNo > 1) {
//        setPageNo = setPageNo - 1;
//    }
//    loadflag = true;
//    isRenderPage = true;
//    $("#txtgopage").val("");
//    renderOrdersDataSummary(setPageNo, "", "");
//    $(".page-btn ").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//});

//$("#next").click(function () {
//    if (setPageNo => 1) {
//        setPageNo = setPageNo + 1;
//    }
//    loadflag = true;
//    isRenderPage = true;
//    $("#txtgopage").val("");
//    renderOrdersDataSummary(setPageNo, "", "");
//    $(".page-btn ").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//});

//$("#divGo").click(function () {
//    let goToPage = parseInt($("#txtgopage").val());
//    if (!isNaN(goToPage)) {
//        setPageNo = goToPage;
//    }

//    if (goToPage > tatalRecordCount) {
//        alert("Please enter a valid page number.");
//        setPageNo = 1;
//        return false;
//    }
//    loadflag = true;
//    isRenderPage = true;
//    renderOrdersDataSummary(setPageNo, "", "");
//    $(".page-btn ").removeClass("active");
//    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
//});

///*Pagination End*/
//function renderChronologyRemarksTable(data) {
//    const tbody = $('#aiChronologyRemarksTableBody');
//    tbody.empty();

//        const row = $(`
//            <tr>
//                <td>${data}</td>
//                <td>""</td>
//                <td>
//                    <input type="text" maxlength="100" class="remarks-input" value="${item.remarks || ''}"  style="width: 100%; height: 80px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;" />
//                    <button class="btn btn-sm btn-success save-btn">Save</button>
//                    <button class="btn btn-sm btn-warning edit-btn" style="display:none;">Edit</button>
//                    <button class="btn btn-sm btn-danger delete-btn" style="display:none;">Delete</button>
//                </td>
//            </tr>
//        `);

//        tbody.append(row);
//}

//$(document).on('click', '.save-btn', function () {
//    const row = $(this).closest('tr');
//    const input = row.find('.remarks-input');
//    const remarks = input.val().trim();

//    if (remarks.length > 100) {
//        alert('Remarks cannot exceed 100 characters.');
//        return;
//    }

//    input.prop('readonly', true);
//    row.find('.save-btn').hide();
//    row.find('.edit-btn, .delete-btn').show();

//    // Here you can make an AJAX call to save it
//    console.log('Saved remarks:', remarks);
//});

//$(document).on('click', '.edit-btn', function () {
//    const row = $(this).closest('tr');
//    const input = row.find('.remarks-input');

//    input.prop('readonly', false);
//    row.find('.save-btn').show();
//    row.find('.edit-btn, .delete-btn').hide();
//});

//$(document).on('click', '.delete-btn', function () {
//    const row = $(this).closest('tr');
//    row.find('.remarks-input').val('');
//    row.find('.remarks-input').prop('readonly', false);
//    row.find('.save-btn').show();
//    row.find('.edit-btn, .delete-btn').hide();

//    console.log('Deleted remarks for row:', row.data('index'));
//});

///*Pagination Start*/
//var isRenderPageChronology = false;
//var totalPageRecChronology = "";
//function renderPaginationChronology(pageindex, totdata) {
//    let totPages = totdata;
//    setPageNo = pageindex;
//    totalPageRecChronology = totdata;
//    let paginationHtml = '';
//    let maxVisible = 4; // Visible page numbers before ellipsis

//    if (totPages <= maxVisible + 2) {
//        for (let i = 1; i <= totPages; i++) {
//            paginationHtml += `<button class="page-btn-Chronology ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//        }
//    } else {
//        if (pageindex <= maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn-Chronology ${i === parseInt(pageindex) ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - 3; j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn-Chronology ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        } else if (pageindex > totPages - maxVisible) {
//            for (let i = 1; i <= 4; i++) {
//                paginationHtml += `<button class="page-btn-Chronology ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - 3; j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn-Chronology ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        } else {
//            paginationHtml += `<button class="page-btn-Chronology" data-page="1">1</button>`;
//            paginationHtml += `<span>.......</span>`;
//            let start = Math.max(2, pageindex - 1);
//            let end = Math.min(totPages - 1, pageindex + 1);
//            for (let i = start; i <= end; i++) {
//                paginationHtml += `<button class="page-btn-Chronology ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }

//            paginationHtml += `<span>.......</span>`;
//            paginationHtml += `<button class="page-btn-Chronology" data-page="${totPages}">${totPages}</button>`;
//        }
//    }

//    $("#pageNumbersChronology").html(paginationHtml);
//    const isPrevDisabled = (pageindex === 1);
//    const isNextDisabled = (pageindex === totPages);

//    $("#nextChronology")
//        .toggleClass("disabled", isNextDisabled)
//        .prop("disabled", isNextDisabled)
//        .attr("aria-disabled", isNextDisabled)
//        .css("display", isNextDisabled ? "none" : "");

//    $("#prevChronology")
//        .toggleClass("disabled", isPrevDisabled)
//        .prop("disabled", isPrevDisabled)
//        .attr("aria-disabled", isPrevDisabled)
//        .css("display", isPrevDisabled ? "none" : "");
//    isRenderPageChronology = true;
//}



//$(document).on("click", ".page-btn-Chronology", function () {
//    let page = $(this).data("page");
//    setPageNo = page;
//    //if (page) changePage(page);
//    loadflag = true;
//    isRenderPageChronology = false;
//    $("#txtgopageChronology").val("");
//    renderOrdersDataChronology(setPageNo, "", "");
//    $(".page-btn-Chronology ").removeClass("active");
//    $(".page-btn-Chronology[data-page='" + setPageNo + "']").addClass("active");
//});

//$("#prevChronology").click(function () {

//    if (setPageNo > 1) {
//        setPageNo = setPageNo - 1;
//    }
//    loadflag = true;
//    isRenderPageChronology = false;
//    $("#txtgopageChronology").val("");
//    //renderPagination(setPageNo, totalPageRec)
//    renderOrdersDataChronology(setPageNo, "", "");
//    $(".page-btn-Chronology ").removeClass("active");
//    $(".page-btn-Chronology[data-page='" + setPageNo + "']").addClass("active");
//});

//$("#nextChronology").click(function () {
//    if (setPageNo => 1) {
//        setPageNo = setPageNo + 1;
//    }
//    loadflag = true;
//    isRenderPageChronology = false;
//    $("#txtgopage").val("");
//    renderOrdersDataChronology(setPageNo, "", "");
//    $(".page-btn-Chronology ").removeClass("active");
//    $(".page-btn-Chronology[data-page='" + setPageNo + "']").addClass("active");
//});

//$("#divGoChronology").click(function () {
//    let goToPage = parseInt($("#txtgopageChronology").val());
//    if (!isNaN(goToPage)) {
//        setPageNo = goToPage;
//    }

//    if (goToPage > tatalRecordCount) {
//        alert("Please enter a valid page number.");
//        setPageNo = 1;
//        return false;
//    }
//    loadflag = true;
//    isRenderPageChronology = false;
//    renderOrdersDataChronology(setPageNo, "", "");
//    $(".page-btn-Chronology ").removeClass("active");
//    $(".page-btn-Chronology[data-page='" + setPageNo + "']").addClass("active");
//});

///*Pagination End*/
//const testChronologyRemarks = [
//    {
//        matterName: 'ABC vs XYZ',
//        chronologyText: 'Case filed on 12th Jan, Hearing on 1st Feb',
//        remarks: ''
//    },
//    {
//        matterName: 'PQR vs DEF',
//        chronologyText: 'Notice served on 5th March',
//        remarks: 'Pending review'
//    }
//];

////Log table for already generated summaries
//$(document).ready(function () {
//    $('#loadSummaryLogBtn').on('click', function () {
//        loadSummaryLogTable();
//    });
//});

//function loadSummaryLogTable() {
//    $('#aiSummaryLogContainer').show();
//    $("#myOverlaySummary").show();
//    $.ajax({
//        url: '/Firm/GetSummaryDetails',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify({
//            MasterCaseId: null,
//            UserCaseId: null
//        }),
//        success: function (response) {
//            const tbody = $('#bindSummaryLog');
//            tbody.empty();

//            if (response && response.success && Array.isArray(response.data)) {
//                const count = response.data.length;
//                $("#summaryResultCount").text("(" + count + ")");
//                if (response.data.length == 0) {
//                    const noDataRow = `
//                        <tr>
//                            <td colspan="5" style="text-align:center; padding:20px;">
//                                <img src="/newassets/img/not-found.png" alt="No data" />
//                                <h4>No Summary List Found</h4>
//                            </td>
//                        </tr>
//                    `;
//                    tbody.append(noDataRow);
//                    return;
//                }
//                $("#myOverlaySummary").hide();
//                response.data.forEach(entry => {
//                    const matterName = entry.MatterName || 'NA';
//                    const orderDates = entry.OrderDates || 'N/A';
//                    const createdOn = formatDotNetDate(entry.CreatedOn);
//                    const orderId = (entry.OrderIds || '').split(',')[0] || '';
//                    const masterCaseID = entry.MasterCaseId || '';
//                    const userCaseId = entry.UserCaseId || '';

//                    const rowHtml = `
//                        <tr>
//                            <td style="padding: 10px;">${matterName}</td>
//                            <td style="padding: 10px;">${orderDates}</td>
//                            <td style="padding: 10px;">${createdOn}</td>
//                            <td style="padding: 10px;">
//                                <img src="/newassets/img/vewdetails.png" title="View Summary"
//                                    onclick="viewGeneratedSummaries('${masterCaseID}', '${userCaseId}', '${orderId}', \`${matterName}\`)"
//                                    style="cursor:pointer; height: 20px; background-color: lightgreen;">
//                            </td>
//                        </tr>`;
//                    tbody.append(rowHtml);
//                });
//            } else {
//                $("#pdatastatusSummary").show();
//                tbody.append('<tr><td colspan="4" class="text-center text-muted">No summaries found.</td></tr>');
//            }
//        },
//        error: function () {
//            $('#bindSummaryLog').html('<tr><td colspan="4" class="text-danger text-center">Failed to load summary log.</td></tr>');
//        }
//    });
//}

//function viewGeneratedSummaries(masterCaseId, userCaseId, orderId, mname) {
//    $.ajax({
//        url: '/Firm/GetSummaryDetails',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify({
//            MasterCaseId: masterCaseId,
//            UserCaseId: userCaseId
//        }),
//        success: function (response) {
//            if (response && response.success && Array.isArray(response.data)) {
//                const matchedSummary = response.data.find(entry => {
//                    if (!entry.OrderIds) return false;
//                    const entryOrderIds = entry.OrderIds.split(',').map(id => id.trim());
//                    return entryOrderIds.includes(orderId.toString().trim());
//                });

//                if (matchedSummary) {
//                    const renderedHTML = marked.parse(matchedSummary.Summary || '');
//                    const orderDatesStr = matchedSummary.OrderDates || '';
//                    const createdOnRaw = matchedSummary.CreatedOn || '';
//                    let createdOnFormatted = '';

//                    const match = /\/Date\((\d+)\)\//.exec(createdOnRaw);
//                    if (match) {
//                        const timestamp = parseInt(match[1], 10);
//                        const dateObj = new Date(timestamp);
//                        createdOnFormatted = dateObj.toLocaleString('en-IN', {
//                            day: '2-digit',
//                            month: 'short',
//                            year: 'numeric',
//                            hour: '2-digit',
//                            minute: '2-digit',
//                            hour12: true
//                        });
//                    }

//                    const newTab = window.open('', '_blank');
//                    if (!newTab) {
//                        alert('Popup blocked. Please allow popups for this site.');
//                        return;
//                    }

//                    newTab.document.write(`
//                        <html>
//                        <head>
//                            <title>AI Summary</title>
//                            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
//                            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
//                            <style>
//                                body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.6; background: #f9f9f9; }
//                                .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative; }
//                                .disclaimer { font-size: 12px; color: #888; text-align: center; font-style: italic; margin-top: 30px; }
//                                .top-right-controls { position: absolute; top: 20px; right: 20px; display: flex; gap: 10px; }
//                                .top-right-controls img { height: 20px; cursor: pointer; }
//                                .header-title h2 { text-align: center; margin-top: 20px; }
//                                @media print {
//                                    #emailSummaryBtn,
//                                    #printSummaryBtn {
//                                        display: none !important;
//                                    }
//                                }
//                            </style>
//                        </head>
//                        <body>
//                            <div class="container">
//                                <div class="top-right-controls">
//                                    <img id="emailSummaryBtn" src="/newassets/img/mail.svg" alt="Email Summary" title="Email Summary" onclick="">
//                                    <img id="printSummaryBtn" src="/newassets/img/print.png" alt="Print Summary" title="Print Summary" onclick="window.print();">
//                                </div>
//                                <div class="header">
//                                    <img src="/newassets/img/logo.png" alt="Logo">
//                                    <div class="header-title"><h2>Summary for Matter: ${mname}</h2></div>
//                                </div>
//                                <div class="summary-info">
//                                    <p><strong>Orders (Order Dates):</strong> ${orderDatesStr}</p>
//                                    <p><strong>Generated On:</strong> ${createdOnFormatted}</p>
//                                </div>
//                                ${renderedHTML}
//                                <div class="disclaimer">
//                                    Disclaimer: This AI-generated summary is for information only. Refer to the original source for full context and understanding.
//                                </div>
//                            </div>
//                            <!-- Injected Email Modal -->
//                            <div id="emailModalCustomSummary" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;justify-content: center;align-items: center;">
//                                <div id="emailModalBox" style="background:#fff;border-radius:8px;width:400px;max-width:90%;max-height:90%;overflow-y:auto;box-shadow:0 5px 15px rgba(0,0,0,0.3);position:relative;">
//                                    <div id="emailModalHeader" style="background-color: #0d6efd; color: white; padding: 12px; font-weight: bold; display: flex ; justify-content: space-between; align-items: center;">
//                                        <h5 id="emailModalTitle" style="font-size:16px;margin:0;"><i class="bi bi-envelope-fill me-2"></i> Send Summary via Email</h5>
//                                        <button id="emailModalCloseBtn" onclick="closeEmailModal()" aria-label="Close" style="background:transparent;border:none;font-size:20px;cursor:pointer;color: white;">×</button>
//                                    </div>
//                                    <div id="emailModalBody" style=" padding: 20px; "><form id="emailFormCustom" novalidate>
//                                        <div style="margin-bottom:15px;">
//                                            <label for="recipientEmail" style="font-weight:600;font-weight:600;color: #414651;font-size: 14px;">Recipient Email <span style="color:red;">*</span></label>
//                                            <input type="email" id="recipientEmail" placeholder="example@domain.com" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;">
//                                        </div>
//                                        <div style="margin-bottom:15px;">
//                                            <label for="emailMessage" style="font-weight:600;font-weight:600;color: #414651;font-size: 14px;">Message</label>
//                                            <textarea id="emailMessage" rows="4" placeholder="Add a short message (optional)..." style="height: 100px !important; width: 100%; padding: 8px !important; border: 1px solid #ccc !important; border-radius: 4px !important;background: #fafafa !important;"></textarea>
//                                        </div>
//                                    </form></div>
//                                    <div id="emailModalFooter" style="padding: 15px 20px; display: flex ; justify-content: space-between; background: #f5f5f5;;">
//                                        <button id="emailCancelBtn" onclick="closeEmailModal()" style="background-color: transparent; border: 1px solid #6c757d; color: #6c757d; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;"><i class="bi bi-x-circle me-1"></i> Cancel</button>
//                                        <button id="emailSendBtn" onclick="sendEmailModal()" style="background-color: #28a745; border: none; color: white; padding: 8px 24px; border-radius: 4px; cursor: pointer; font-weight: 600;"><i class="bi bi-send-fill me-1"></i> Send</button>
//                                    </div>
//                                </div>
//                            </div>
//                            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
//                            <script>
//                                // Show email modal when clicking the envelope icon
//                                $('#emailSummaryBtn').on('click', function() {
//                                    $('#emailModalCustomSummary').show();
//                                    $('#emailModalCustomSummary').css('display', 'flex');
//                                    });
//                                    $('#emailModalCloseBtn').on('click', function() {
//                                        $('#emailModalCustomSummary').css('display', 'none');
//                                });

//                                function closeEmailModal() {
//                                    $('#emailModalCustomSummary').fadeOut();
//                                }
//                                    async function sendEmailModal(mname) {
//                                        const recipient = document.getElementById("recipientEmail").value.trim();
//                                        const userMessage = document.getElementById("emailMessage").value.trim();

//                                        if (!recipient) {
//                                            alert("Please enter a recipient email.");
//                                            return;
//                                        }
//                                        $('#myOverlaySummary').show();
//                                        const container = document.querySelector(".container");
//                                        if (!container) {
//                                            alert("Could not find summary container.");
//                                            return;
//                                        }
//                                        let filename = mname;
//                                            if (!filename) {
//                                                const h2 = container.querySelector("h2");
//                                                filename = h2 ? h2.textContent.trim().replace(/\s+/g, "_") : "document";
//                                            }

//                                        try {
//                                            const emailIcon = document.getElementById("emailSummaryBtn");
//                                            const printIcon = document.getElementById("printSummaryBtn");
//                                            if (emailIcon) emailIcon.style.display = "none";
//                                            if (printIcon) printIcon.style.display = "none";
//                                            const pdfBlob = await htmlToPDFBlob(container, filename);

//                                            // Convert Blob → Base64
//                                            const base64Pdf = await new Promise((resolve, reject) => {
//                                                const reader = new FileReader();
//                                                reader.onloadend = () => {
//                                                    const base64data = reader.result.split(',')[1];
//                                                    resolve(base64data);
//                                                };
//                                                reader.onerror = (err) => {
//                                                    reject(err);
//                                                };
//                                                reader.readAsDataURL(pdfBlob);
//                                            });
//                                            // Build payload
//                                                const payload = {
//                                                    To: recipient,
//                                                    Subject: filename,
//                                                    Message: userMessage,
//                                                    AttachmentBase64: base64Pdf,
//                                                    AttachmentFileName: filename + ".pdf"
//                                                };
//                                            const response = await fetch('/Firm/SendOcrEmail', {
//                                                method: 'POST',
//                                                headers: { 'Content-Type': 'application/json' },
//                                                body: JSON.stringify(payload),
//                                            });
//                                            $('#myOverlaySummary').hide();

//                                            if (response.ok) {
//                                                alert("E-mail has been sent successfully.");
//                                                document.getElementById("recipientEmail").value = "";
//                                                document.getElementById("emailMessage").value = "";
//                                                if (emailIcon) emailIcon.style.display = "";
//                                                if (printIcon) printIcon.style.display = "";
//                                                closeEmailModal();
//                                            } else {
//                                                $('#myOverlaySummary').hide();
//                                                alert("There was an error while sending the e-mail. Please try again.");
//                                            }
//                                        } catch (error) {
//                                            $('#myOverlaySummary').hide();
//                                        }
//                                     finally {
//                                        if (emailIcon) emailIcon.style.display = "";
//                                        if (printIcon) printIcon.style.display = "";
//                                        $('#myOverlaySummary').hide();
//                                    }

//                                    }
//                                    function htmlToPDFBlob(element, fileName) {
//                                        return new Promise((resolve, reject) => {
//                                            const options = {
//                                                margin: 0.5,
//                                                filename: fileName + ".pdf",
//                                                image: { type: 'jpeg', quality: 0.98 },
//                                                html2canvas: { scale: 2, logging: true }, // enable html2canvas logging
//                                                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//                                            };
//                                            try {
//                                                html2pdf()
//                                                    .set(options)
//                                                    .from(element)
//                                                    .toPdf()
//                                                    .get('pdf')
//                                                    .then(pdf => {
//                                                        const blob = pdf.output('blob');
//                                                        resolve(blob);
//                                                    });
//                                            } catch (err) {
//                                                reject(err);
//                                            }
//                                        });
//                                    }
//                            </script>

//                        </body>
//                        </html>
//                    `);
//                    newTab.document.close();
//                } else {
//                    alert("No summary found for this order.");
//                }
//            } else {
//                alert("Failed to retrieve summary.");
//            }
//        },
//        error: function () {
//            alert("Error occurred while fetching summary.");
//        }
//    });
//}

//function formatDotNetDate(dateStr) {
//    if (!dateStr) return 'N/A';
//    const match = /\/Date\((\d+)\)\//.exec(dateStr);
//    if (!match) return dateStr;

//    const date = new Date(parseInt(match[1], 10));
//    return date.toLocaleDateString('en-GB', {
//        day: '2-digit',
//        month: 'short',
//        year: 'numeric'
//    });
//}

//function loadChronologyLogTable() {
//    $('#aiChronologyLogContainer').show();
//    $('#myOverlaySummary').show();
//    $.ajax({
//        url: '/Firm/GetChronologyDetails',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify({
//            MasterCaseId: null,
//            UserCaseId: null
//        }),
//        success: function (response) {
//            const tbody = $('#bindChronologyLog');
//            tbody.empty();

//            if (response && response.success && Array.isArray(response.data)) {
//                const count = response.data.length;
//                $("#chronologyResultCount").text("(" + count + ")");
//                if (response.data.length == 0) {
//                    const noDataRow = `
//                        <tr>
//                            <td colspan="5" style="text-align:center; padding:20px;">
//                                <img src="/newassets/img/not-found.png" alt="No data" />
//                                <h4>No Chronology List Found</h4>
//                            </td>
//                        </tr>
//                    `;
//                    tbody.append(noDataRow);
//                    return;
//                }
//                $("#myOverlaySummary").hide();
//                response.data.forEach(entry => {
//                    const matterName = entry.MatterName || 'NA';
//                    const orderDates = entry.OrderDates || 'N/A';
//                    const createdOn = formatDotNetDate(entry.CreatedOn);
//                    const orderId = (entry.OrderIds || '').split(',')[0] || '';
//                    const masterCaseId = entry.MasterCaseId || '';
//                    const userCaseId = entry.UserCaseId || '';
//                    const remarks = entry.Remarks || '';
//                    const jobId = entry.JobId || '';

//                    const uniqueId = `${masterCaseId}_${userCaseId}`.replace(/[^a-zA-Z0-9_]/g, '');

//                    let remarksContent = '';
//                    if (remarks) {
//                        remarksContent = `
//                            <div id="savedRemarksBlock_${uniqueId}">
//                                <span>${remarks}</span>
//                                <button onclick="editRemarks('${uniqueId}', '${masterCaseId}', '${userCaseId}')" style=" border: none; padding: 0; border-radius: 10px;"><span><img src="/newassets/img/edit-icon.png" title="Edit Remarks" style="cursor: pointer;" /></span></button>
//                                <button onclick="deleteRemarks('${masterCaseId}', '${userCaseId}', '${uniqueId}')" style=" border: none; padding: 0;border-radius: 10px; "><span><img src="/newassets/img/deletecasesingle-icon.png" title="Delete Remarks" style="cursor: pointer;" /></span></button>
//                            </div>
//                        `;
//                    } else {
//                        remarksContent = `
//                            <div id="remarksInputBlock_${uniqueId}">
//                                <input type="text" id="remarksInput_${uniqueId}" placeholder="Add remarks..." style=" border: 1px lightgrey solid; border-radius: 10px; padding: 4px; "/>
//                                <button onclick="saveOrUpdateRemarks('${masterCaseId}', '${userCaseId}', '${uniqueId}')" style=" border: none; padding: 0; border-radius: 10px; "><span><img src="/newassets/img/save-icon.png" title="Save Remarks" style="cursor: pointer;" /></span></button>
//                            </div>
//                        `;
//                    }

//                    const rowHtml = `
//                        <tr>
//                            <td style="padding: 10px;">${matterName}</td>
//                            <td style="padding: 10px;">${orderDates}</td>
//                            <td style="padding: 10px;">${createdOn}</td>
//                            <td style="padding: 10px;">
//                                <img src="/newassets/img/vewdetails.png" title="View Chronology"
//                                    onclick="viewGeneratedChronologies('${masterCaseId}', '${userCaseId}', '${orderId}', \`${matterName}\`)"
//                                    style="cursor:pointer; height: 20px; background-color: lightgreen;">
//                            </td>
//                            <td style="padding: 10px;" id="remarksContainer_${uniqueId}">
//                                ${remarksContent}
//                            </td>
//                        </tr>`;
//                    tbody.append(rowHtml);
//                });
//            } else {
//                $("#pdatastatusChronology").show();
//            }
//        },
//        error: function () {
//            $('#bindChronologyLog').html('<tr> <td colspan="5" style="text-align:center; padding:20px;"> <img src="/newassets/img/not-found.png" alt="No data" /> <h4>No Chronology list found</h4> </td> </tr>');
//        }
//    });
//}

//// Unified save/edit function
//function saveOrUpdateRemarks(masterCaseId, userCaseId, uniqueId) {
//    const input = document.getElementById(`remarksInput_${uniqueId}`);
//    const remarks = input.value.trim();
//    if (!remarks) {
//        alert("Please enter remarks before saving.");
//        return;
//    }

//    fetch('/Firm/SaveChronologyRemarks', {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify({
//            MasterCaseId: masterCaseId,
//            UserCaseId: userCaseId,
//            Remarks: remarks,
//            Action: 'UPDATE_REMARKS'
//        })
//    })
//        .then(res => res.json())
//        .then(res => {
//            if (res.success) {
//                // Update UI to saved remarks display
//                document.getElementById(`remarksContainer_${uniqueId}`).innerHTML = `
//                <div id="savedRemarksBlock_${uniqueId}">
//                    <span>${remarks}</span>
//                    <button onclick="editRemarks('${uniqueId}', '${masterCaseId}', '${userCaseId}')" style=" border: none; padding: 0;border-radius: 10px; "><span><img src="/newassets/img/edit-icon.png" title="Edit Remarks" style="cursor: pointer;" /></span></button>
//                    <button onclick="deleteRemarks('${masterCaseId}', '${userCaseId}', '${uniqueId}')" style=" border: none; padding: 0;border-radius: 10px; "><span><img src="/newassets/img/deletecasesingle-icon.png" title="Delete Remarks" style="cursor: pointer;" /></span></button>
//                </div>
//            `;
//            } else {
//                //alert("Failed to save remarks.");
//            }
//        })
//        .catch(error => console.log('Failed to save remarks:', error));
//}

//function editRemarks(uniqueId, masterCaseId, userCaseId) {
//    const savedBlock = document.getElementById(`savedRemarksBlock_${uniqueId}`);
//    const currentRemarks = savedBlock.querySelector('span').innerText;

//    document.getElementById(`remarksContainer_${uniqueId}`).innerHTML = `
//        <div id="remarksInputBlock_${uniqueId}">
//            <input type="text" style="border: 1px solid grey; padding: 5px;" id="remarksInput_${uniqueId}" value="${currentRemarks}" />
//            <button onclick="saveOrUpdateRemarks('${masterCaseId}', '${userCaseId}', '${uniqueId}')" style=" border: none; padding: 0;border-radius: 10px; "><span><img src="/newassets/img/save-icon.png" title="Save Remarks" style="cursor: pointer;" /></span></button>
//        </div>
//    `;
//}

//function deleteRemarks(masterCaseId, userCaseId, uniqueId) {
//    fetch('/Firm/RemoveChronologyRemarks', {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify({
//            MasterCaseId: masterCaseId,
//            UserCaseId: userCaseId
//        })
//    })
//        .then(res => res.json())
//        .then(res => {
//            if (res.success) {
//                document.getElementById(`remarksContainer_${uniqueId}`).innerHTML = `
//                <div id="remarksInputBlock_${uniqueId}">
//                    <input type="text" id="remarksInput_${uniqueId}" placeholder="Add remarks..." style=" border: 1px lightgrey solid; border-radius: 10px; padding: 4px; " />
//                    <button onclick="saveOrUpdateRemarks('${masterCaseId}', '${userCaseId}', '${uniqueId}')" style=" border: none; padding: 0;border-radius: 10px; "><span><img src="/newassets/img/save-icon.png" title="Save Remarks" style="cursor: pointer;" /></span></button>
//                </div>
//            `;
//            } else {
//                console.log('Failed to delete remarks:', error);
//            }
//        })
//        .catch(error => console.log('Failed to delete remarks:', error));
//}

//function viewGeneratedChronologies(masterCaseId, userCaseId, orderId, mname) {
//    $.ajax({
//        url: '/Firm/GetChronologyDetails',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify({
//            MasterCaseId: masterCaseId,
//            UserCaseId: userCaseId
//        }),
//        success: function (response) {
//            if (response && response.success && Array.isArray(response.data)) {
//                const matchedChronology = response.data.find(entry => {
//                    if (!entry.OrderIds) return false;
//                    const entryOrderIds = entry.OrderIds.split(',').map(id => id.trim());
//                    return entryOrderIds.includes(orderId.toString().trim());
//                });

//                if (matchedChronology) {
//                    const renderedHTML = marked.parse(matchedChronology.Chronology || '');
//                    const orderDatesStr = matchedChronology.OrderDates || '';
//                    const createdOnRaw = matchedChronology.CreatedOn || '';
//                    const remarks = matchedChronology.Remarks || '';
//                    let createdOnFormatted = '';

//                    const match = /\/Date\((\d+)\)\//.exec(createdOnRaw);
//                    if (match) {
//                        const timestamp = parseInt(match[1], 10);
//                        const dateObj = new Date(timestamp);
//                        createdOnFormatted = dateObj.toLocaleString('en-IN', {
//                            day: '2-digit',
//                            month: 'short',
//                            year: 'numeric',
//                            hour: '2-digit',
//                            minute: '2-digit',
//                            hour12: true
//                        });
//                    }

//                    const newTab = window.open('', '_blank');
//                    if (!newTab) {
//                        alert('Popup blocked. Please allow popups for this site.');
//                        return;
//                    }

//                    newTab.document.write(`
//                        <html>
//                        <head>
//                            <title>AI Chronology</title>
//                            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
//                            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"></script>
//                            <style>
//                                body { font-family: Arial, sans-serif; padding: 30px; line-height: 1.6; background: #f9f9f9; }
//                                .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); position: relative; }
//                                .disclaimer { font-size: 12px; color: #888; text-align: center; font-style: italic; margin-top: 30px; }
//                                .top-right-controls { position: absolute; top: 20px; right: 20px; display: flex; gap: 10px; }
//                                .top-right-controls img { height: 20px; cursor: pointer; }
//                                .header-title h2 { text-align: center; margin-top: 20px; }
//                                @media print {
//                                    #emailChronologyBtn,
//                                    #printChronologyBtn {
//                                        display: none !important;
//                                    }
//                                }
//                            </style>
//                        </head>
//                        <body>
//                            <div class="container">
//                                <div class="top-right-controls">
//                                    <img id="emailChronologyBtn" src="/newassets/img/mail.svg" alt="Email Chronology" title="Email Chronology" onclick="">
//                                    <img id="printChronologyBtn" src="/newassets/img/print.png" alt="Print Chronology" title="Print Chronology" onclick="window.print();">
//                                </div>
//                                <div class="header">
//                                    <img src="/newassets/img/logo.png" alt="Logo">
//                                    <div class="header-title"><h2>Chronology for Matter: ${mname}</h2></div>
//                                </div>
//                                <div class="summary-info">
//                                    <p><strong>Orders (Order Dates):</strong> ${orderDatesStr}</p>
//                                    <p><strong>Generated On:</strong> ${createdOnFormatted}</p>
//                                    ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
//                                </div>
//                                ${renderedHTML}
//                                <div class="disclaimer">
//                                    Disclaimer: This AI-generated chronology is for information only. Refer to the original source for full context and understanding.
//                                </div>
//                            </div>
//                            <!-- Injected Email Modal -->
//                            <div id="emailModalCustomChronology" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;justify-content: center;align-items: center;">
//                                <div id="emailModalBox" style="background:#fff;border-radius:8px;width:400px;max-width:90%;max-height:90%;overflow-y:auto;box-shadow:0 5px 15px rgba(0,0,0,0.3);position:relative;">
//                                    <div id="emailModalHeader" style="background-color: #0d6efd; color: white; padding: 12px; font-weight: bold; display: flex ; justify-content: space-between; align-items: center;">
//                                        <h5 id="emailModalTitle" style="font-size:16px;margin:0;"><i class="bi bi-envelope-fill me-2"></i> Send Chronology via Email</h5>
//                                        <button id="emailModalCloseBtn" onclick="closeEmailModal()" aria-label="Close" style="background:transparent;border:none;font-size:20px;cursor:pointer;color: white;">×</button>
//                                    </div>
//                                    <div id="emailModalBody" style=" padding: 20px; "><form id="emailFormCustom" novalidate>
//                                        <div style="margin-bottom:15px;">
//                                            <label for="recipientEmail" style="font-weight:600;font-weight:600;color: #414651;font-size: 14px;">Recipient Email <span style="color:red;">*</span></label>
//                                            <input type="email" id="recipientEmail" placeholder="example@domain.com" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;">
//                                        </div>
//                                        <div style="margin-bottom:15px;">
//                                            <label for="emailMessage" style="font-weight:600;font-weight:600;color: #414651;font-size: 14px;">Message</label>
//                                            <textarea id="emailMessage" rows="4" placeholder="Add a short message (optional)..." style="height: 100px !important; width: 100%; padding: 8px !important; border: 1px solid #ccc !important; border-radius: 4px !important;background: #fafafa !important;"></textarea>
//                                        </div>
//                                    </form></div>
//                                    <div id="emailModalFooter" style="padding: 15px 20px; display: flex ; justify-content: space-between; background: #f5f5f5;;">
//                                        <button id="emailCancelBtn" onclick="closeEmailModal()" style="background-color: transparent; border: 1px solid #6c757d; color: #6c757d; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600;"><i class="bi bi-x-circle me-1"></i> Cancel</button>
//                                        <button id="emailSendBtn" onclick="sendEmailModal()" style="background-color: #28a745; border: none; color: white; padding: 8px 24px; border-radius: 4px; cursor: pointer; font-weight: 600;"><i class="bi bi-send-fill me-1"></i> Send</button>
//                                    </div>
//                                </div>
//                            </div>
//                            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
//                                                        <script>
//                                 // Show email modal when clicking the envelope icon
//                                 $('#emailChronologyBtn').on('click', function() {
//                                     $('#emailModalCustomChronology').show();
//                                     $('#emailModalCustomChronology').css('display', 'flex');
//                                     });
//                                     $('#emailModalCloseBtn').on('click', function() {
//                                         $('#emailModalCustomChronology').css('display', 'none');
//                                 });

//                                 function closeEmailModal() {
//                                     $('#emailModalCustomChronology').fadeOut();
//                                 }
//                                     async function sendEmailModal(mname) {
//                                         const recipient = document.getElementById("recipientEmail").value.trim();
//                                         const userMessage = document.getElementById("emailMessage").value.trim();

//                                         if (!recipient) {
//                                             alert("Please enter a recipient email.");
//                                             return;
//                                         }
//                                         $('#myOverlayChronology').show();
//                                         const container = document.querySelector(".container");
//                                         if (!container) {
//                                             alert("Could not find summary container.");
//                                             return;
//                                         }
//                                         let filename = mname;
//                                             if (!filename) {
//                                                 const h2 = container.querySelector("h2");
//                                                 filename = h2 ? h2.textContent.trim().replace(/\s+/g, "_") : "document";
//                                             }

//                                         try {
//                                             const emailIcon = document.getElementById("emailChronologyBtn");
//                                             const printIcon = document.getElementById("printChronologyBtn");
//                                             if (emailIcon) emailIcon.style.display = "none";
//                                             if (printIcon) printIcon.style.display = "none";
//                                             const pdfBlob = await htmlToPDFBlob(container, filename);

//                                             // Convert Blob → Base64
//                                             const base64Pdf = await new Promise((resolve, reject) => {
//                                                 const reader = new FileReader();
//                                                 reader.onloadend = () => {
//                                                     const base64data = reader.result.split(',')[1];
//                                                     resolve(base64data);
//                                                 };
//                                                 reader.onerror = (err) => {
//                                                     reject(err);
//                                                 };
//                                                 reader.readAsDataURL(pdfBlob);
//                                             });
//                                             // Build payload
//                                                 const payload = {
//                                                     To: recipient,
//                                                     Subject: filename,
//                                                     Message: userMessage,
//                                                     AttachmentBase64: base64Pdf,
//                                                     AttachmentFileName: filename + ".pdf"
//                                                 };
//                                             const response = await fetch('/Firm/SendOcrEmail', {
//                                                 method: 'POST',
//                                                 headers: { 'Content-Type': 'application/json' },
//                                                 body: JSON.stringify(payload),
//                                             });
//                                             $('#myOverlayChronology').hide();

//                                             if (response.ok) {
//                                                 alert("E-mail has been sent successfully.");
//                                                 document.getElementById("recipientEmail").value = "";
//                                                 document.getElementById("emailMessage").value = "";

//                                                if (emailIcon) emailIcon.style.display = "";
//                                                if (printIcon) printIcon.style.display = "";
//                                                 closeEmailModal();
//                                             } else {
//                                                 $('#myOverlayChronology').hide();
//                                                 alert("There was an error while sending the e-mail. Please try again.");
//                                             }
//                                         } catch (error) {
//                                             $('#myOverlayChronology').hide();
//                                         }
//                                     finally {
//                                        if (emailIcon) emailIcon.style.display = "";
//                                        if (printIcon) printIcon.style.display = "";
//                                        $('#myOverlaySummary').hide();
//                                    }

//                                     }
//                                     function htmlToPDFBlob(element, fileName) {
//                                         return new Promise((resolve, reject) => {
//                                             const options = {
//                                                 margin: 0.5,
//                                                 filename: fileName + ".pdf",
//                                                 image: { type: 'jpeg', quality: 0.98 },
//                                                 html2canvas: { scale: 2, logging: true }, // enable html2canvas logging
//                                                 jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//                                             };
//                                             try {
//                                                 html2pdf()
//                                                     .set(options)
//                                                     .from(element)
//                                                     .toPdf()
//                                                     .get('pdf')
//                                                     .then(pdf => {
//                                                         const blob = pdf.output('blob');
//                                                         resolve(blob);
//                                                     });
//                                             } catch (err) {
//                                                 reject(err);
//                                             }
//                                         });
//                                     }
//                             </script>
//                        </body>
//                        </html>
//                    `);
//                    newTab.document.close();
//                } else {
//                    alert("No chronology found for this order.");
//                }
//            } else {
//                alert("Failed to retrieve chronology.");
//            }
//        },
//        error: function () {
//            alert("Error occurred while fetching chronology.");
//        }
//    });
//}


$(document).ready(function () {

    if (!window.AI_CONTEXT) return;

    const masterCaseId = AI_CONTEXT.masterCaseId;
    const userCaseId = AI_CONTEXT.userCaseId;
    const matterName = AI_CONTEXT.matterName;
    const IsRevenueCourt = AI_CONTEXT.IsRevenueCourt || 0;
    const IsReraCourt = AI_CONTEXT.IsReraCourt || 0;

    // Show matter name
    $("#mname").text(matterName || "");
    localStorage.setItem("pathAITools", "");

    loadCaseOrders(masterCaseId, userCaseId, IsRevenueCourt, IsReraCourt);
    GetAIToolsQuota();
});
function openMyKasePicker(event) {
    event.preventDefault();
}

function loadCaseOrders(masterCaseId, userCaseId, IsRevenueCourt, IsReraCourt) {

    const formData = new FormData();
    formData.append("id", masterCaseId);
    formData.append("caseid", userCaseId);
    formData.append("IsRevenueCourt", IsRevenueCourt);
    formData.append("IsReraCourt", IsReraCourt);
    $('#myOverlaySummary').show();
    $.ajax({
        async: true,
        type: "POST",
        url: "/firm/ListCaseOrders",
        dataType: "json",
        data: formData,
        contentType: false,
        processData: false,

        success: function (response) {
            $('#myOverlaySummary').hide();
            $("#Custdatastatus").hide();
            let html = "";
            let OrderDataDivData = "";
            let DisputeLandDetailsDivData = "";

            // Clear old data
            $("#bindcaseorder").html("");
            $("#OrderData").html("");
            $("#DisputeLandDetails").html("");
            $("#nocaseorderstatus").html("");

            if (!response || response.length === 0) {
                $("#Custdatastatus").show();
                //$("#generateSummaryButton, #generateChronologyButton, #btnTranslate, #btnAskAI").prop("disabled", true);
                //$("#toggleHistory").addClass("disabled");
                return;
            }
            //$("#generateSummaryButton, #generateChronologyButton, #btnTranslate, #btnAskAI").prop("disabled", false); 
            //$("#toggleHistory").removeClass("disabled"); 

            if (String(IsRevenueCourt) === "1") {

                $.each(response, function (i, a) {

                    if (a.OrderData) {
                        html += `
                            <tr>
                             <td>
                                        <input
                                            type="checkbox"
                                            class="order-checkbox"
                                            data-vlocalfile="${a.vLocalFile}"
                                            data-orderid="${a.Id}"
                                       />
                                    </td>
                                <td>${a.Order_Date}</td>
                                <td>${a.Status}</td>
                            </tr>
                        `;

                        OrderDataDivData = a.OrderData.replace(
                            "BOR/",
                            "http://vaad.up.nic.in/BOR/"
                        );

                        DisputeLandDetailsDivData = a.DisputeLandDetails || "";
                    }
                });

            } else {

                $.each(response, function (i, a) {

                    let enableOrderNotes = `
                        <a class="taskoutboxbtnicon" title="Show order notes" href="javascript:void(0)">
                            <span onclick="OpenOrderNotes(${a.Id})">
                                <img src="/newassets/images/ViewOrderDetails.png"/>
                            </span>
                        </a>`;

                    html += `
                        <tr>
                        <td>
                                        <input
                                            type="checkbox"
                                            class="order-checkbox"
                                            data-vlocalfile="${a.vLocalFile}"
                                            data-orderid="${a.Id}"
                                       />
                                    </td>
                            <td style="text-align:center">${a.Order_Date}</td>
                            <td style="display:flex; justify-content:center">
                                <ul class="table_action">
                                    ${a.Filepath ? `
                                        <li>
                                            <a class="taskoutboxbtnicon"
                                               href="/DownloadFile.ashx?module=caseorder&ftoken=${a.Filepath}"
                                               download="${a.Filename}">
                                                <img src="/newassets/img/download.svg"/>
                                            </a>
                                        </li>
                                        <li>
                                            <span class="taskoutboxbtnicon"
                                                  title="Email Matter order"
                                                  id="emailorder" 
                                                  FileName="${a.Filename}"
                                                  casetoken="${userCaseId}"
                                                  ftoken="${a.Filepath}">
                                                <img src="/newassets/img/mail.svg"/>
                                            </span>
                                        </li>
                                        <li>
                                            <a class="taskoutboxbtnicon"
                                               title="View Order"
                                               href="${a.vLocalFile}"
                                               filepath="${a.vLocalFile}"
                                               Filename="${a.Filename}"
                                               target="_blank"
                                               rel="noopener noreferrer">
                                                <img src="/newassets/img/eye.svg"/>
                                            </a>
                                        </li>
                                    ` : ""}
                                    ${enableOrderNotes}
                                </ul>
                            </td>
                        </tr>
                    `;

                    OrderDataDivData = a.OrderData || "";
                    DisputeLandDetailsDivData = a.DisputeLandDetails || "";
                });
            }

            $("#bindcaseorder").html(html);

            if (String(IsRevenueCourt) === "1") {
                $("#OrderData").html(OrderDataDivData || "");
                $("#DisputeLandDetails").html(DisputeLandDetailsDivData || "");

                if (!OrderDataDivData && !DisputeLandDetailsDivData) {
                    $("#nocaseorderstatus").html("No data available.");
                }
            }
            $('#myOverlaySummary').hide();
        },

        failure: function (response) {
            $('#myOverlaySummary').hide();
            alert(response.responseText || "Request failed");
        },

        error: function (response) {
            $('#myOverlaySummary').hide();
            alert(response.responseText || "Something went wrong");
        }
    });
}

function OpenOrderNotes(val) {
    var ids = val;
    $("#SaveOrderNotes").attr("data", ids);
    $("#hdnOrderid").val(ids);
    $("#Otherordertxt").val('');
    bindOrderDetails(ids);
    $('#myModalOrderNotes').modal({ show: true });
    $('#myModalOrderNotes').css("z-index", "1100");
}

function bindOrderDetails(val) {
    var formData = new FormData();
    $("#orderdetailsContent").html('');
    formData.append("id", val);
    formData.append("search", "");
    var html6 = "";
    $.ajax({
        type: "POST",
        url: "/CW/MyCaseOrderNotes", // Controller/View
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = JSON.parse(response);
            if (obj.data == "[]") {
                $("#orderdetailsContentNA").show();
            }
            else {
                $("#orderdetailsContentNA").hide();
            }
            $.each(obj.data, function (i, a) {
                html6 += "<tr>";
                html6 += "<td>" + a.CreatedDate + "</td>";
                html6 += "<td id='tdnotes'>" + a.Notes + "</td>";
                html6 += "</tr>";
                $("#orderdetailsContent").html(html6).attr("ids", a.Iid);
            });
            return false;
        },
        failure: function (response) {
            alert(response.responseText);
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
}

$(document).on("click", "#SaveOrderNotes", function () {
    var noteid = $("#SaveOrderNotes").attr("data");
    var formData = new FormData();
    formData.append("Orderid", noteid);
    formData.append("Notes", $('#Otherordertxt').val());
    openload();
    $.ajax(
        {
            type: "POST",
            url: "/CW/OrderAddNotes", // Controller/View
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var data = JSON.parse(response);
                if (String(data.Status) == "true") {
                    alert("Order notes details updated successfully.");
                    $("#Otherordertxt").val('');
                    OpenOrderNotes(noteid);
                    closeload();
                }
                else {
                    alert("something went wrong!");
                    closeload();
                }
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
});

$(".tab-item").on("click", function () {

    // Activate tab
    $(".tab-item").removeClass("active");
    $(this).addClass("active");

    // Show correct tab content
    const tabId = $(this).data("tab");
    $(".tab-content").removeClass("active").hide();
    $("#" + tabId).addClass("active").show();

    // Show history section
    $("#aiHistoryWrapper").slideDown(200);

    // Update history title (for now only text)
    const type = $(this).data("type");
    let titleText = "History";

    if (type === "summary") titleText = "Summary History";
    else if (type === "chronology") titleText = "Chronology History";
    else if (type === "translation") titleText = "Translation History";
    else if (type === "askai") titleText = "Ask AI History";

    $("#historyTitle").text(titleText);
});

//Translation View
$(document).ready(function () {

    $("#btnTranslate").on("click", function () {
        $(".ai-tools-grid").hide();
        $("#aiResultContainer").hide();
        $("#titleAITools").text("AI Translation");
        $("#translateView").show();
    });

    $("#btnBackToTools").on("click", function () {
        $("#translateView").hide();
        $(".ai-tools-grid").show();
        $("#titleAITools").text("Welcome to AI Tools");
    });

});

$('#btnTranslateNow').on('click', async function () {
    let selectedUrls = [];
    const checkedBox = $('.order-checkbox:checked').first();
    GetAIToolsQuota();
    let MKDrivePathAITools = localStorage.getItem("pathAITools");

    if (MKDrivePathAITools) {
        selectedUrls.push(MKDrivePathAITools);
    }
    else if (!MKDrivePathAITools || MKDrivePathAITools.trim() === "") {

        $('.order-checkbox:checked').each(function () {
            const url = $(this).data('vlocalfile');
            if (url) {
                selectedUrls.push(url);
            }
        });
    }
    else {
        $('.order-checkbox:checked').each(function () {
            const url = $(this).data('vlocalfile');
            if (url) {
                selectedUrls.push(url);
            }
        });
    }
    if (TotalUsedQuota >= totalQuotaAITools) {
        alert("Your AI Tools quota has been exhausted.");
        return;
    }

        // Validation for one file  
    if (selectedUrls.length === 0) {
        alert("Please select a file to translate.");
        return;
    }

    if (selectedUrls.length > 1) {
        alert("Only one file can be translated at a time.");
        return;
    }
    
    $('#myOverlaySummary').show();
    const fileUrl = selectedUrls[0];
    const selectedOrderId = checkedBox.data('orderid') || "";
    const orderDateText = checkedBox
        .closest('tr')
        .find('td:nth-child(2)')
        .text()
        .trim()
        .split('\n')[0];
    const fileNameTranslate = fileUrl ? fileUrl.split('/').pop() : "";

    const orderDatesSummary = orderDateText || fileNameTranslate || "No Order Date";

    try {
        //Update Credits
        const response = await $.ajax({
            url: '/Firm/GetTotalPdfPages',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(selectedUrls)
        });

        $(".loading").hide();

        if (!response.success) {
            alert(response.message || "Something went wrong");
            $('#myOverlaySummary').hide();
            return;
        }

        const totalPages = response.totalPages || 0;
        const quota = totalPages * 15;

        if (TotalUsedQuota + quota >= totalQuotaAITools) {
            alert("Your AI Tools quota is not sufficient to process this request.");
            $('#myOverlaySummary').hide();
            return; 
        }

        console.log("Total Pages:", totalPages);
        console.log("Quota:", quota);

        InsertAIToolsQuota(totalQuotaAITools, quota, "Translate");


        $('#myOverlayChronology').show();
        const lang = $('#srcLang').val();
        // Fetch file and convert to blob
        //const fileResponse = await fetch(fileUrl);
        //const blob = await fileResponse.blob();

        //const fileName = fileUrl.split('/').pop() || 'document.html';

        const formData = new FormData();
        formData.append("filePath", fileUrl);
        formData.append("lang", lang); 

        const apiResponse = await fetch('/Firm/UploadOrderFilesTranslation', {
            method: 'POST',
            body: formData
        });

        const result = await apiResponse.json();
        $('#myOverlayChronology').hide();
        $('#myOverlaySummary').hide();

        if (result && result.result) {
            const renderedHTML = result.result;
            // Wrap HTML safely for iframe
            const iframeHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <base target="_blank">
            <style>
                body { margin:0; padding:0; }
            </style>
        </head>
        <body>
            ${result.result}
        </body>
        </html>
    `;

            const iframe = `
        <iframe 
            class="translation-iframe"
            style="width:100%; height:600px; border:none; border-radius:8px;"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            srcdoc='${iframeHtml.replace(/'/g, "&apos;")}'
        ></iframe>
    `;

            // Show result in AI tools panel
            $("#aiResultContent").html(iframe);
            $("#aiResultContainer").show();
            $("#translateView").hide();
            $("#aiResultContainer")[0].scrollIntoView({ behavior: "smooth" });
            $("#titleAITools").hide();

            $(".ai-tools-grid").css({
                "display": "flex",
                "gap": "10px",
                "justify-content": "flex-start",
                "align-items": "center",
                "font-size": "12px",
                "margin-top": "10px"
            });
            // 💾 SAVE SUMMARY
            const userCaseId = localStorage.getItem("AIUserCaseid") || "";
            const masterCaseId = localStorage.getItem("AIMasterCaseId") || "";
            const mname = localStorage.getItem("mnameSummary");
            if (userCaseId && masterCaseId) {
                $.ajax({
                    url: "/Firm/SaveTranslationDetails",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        UserCaseId: userCaseId,
                        MasterCaseId: masterCaseId,
                        MatterName: mname,
                        Summary: renderedHTML,
                        //OrderIds: selectedOrderIds.join(","),
                        OrderIds: (typeof selectedOrderIds !== "undefined" && selectedOrderIds?.length) ? selectedOrderIds.join(",") : (MKDrivePathAITools || ""),
                        OrderDates: orderDatesSummary,
                        CreatedOn: new Date().toISOString()
                    })
                });
            }
        } else if (result.error) {
            $('#myOverlaySummary').hide();
            alert(result.error);
        } else {
            $('#myOverlaySummary').hide();
            alert("Translation failed.");
        }
    } catch (err) {
        $('#myOverlayChronology').hide();
        console.error(err);
        $('#myOverlaySummary').hide();
        //alert("Error while translating file.");
    }
});

function showTranslationHistory() {
    const masterId = localStorage.getItem("AIMasterCaseId");
    const userCaseIdSummary = localStorage.getItem("AIUserCaseid");
    const mname = localStorage.getItem("mnameSummary");

    $('#orderSummaryModalMatter').empty();

    let matterNameSummary = mname || 'Unknown Matter';
    $('#orderSummaryModal').modal('show');
    $('#orderSummaryModalMatter').append(matterNameSummary);

    $('#myOverlaySummary').show();
    $('#orderChronologyModal').hide();

    $.ajax({
        url: '/Firm/GetTranslationDetails',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            MasterCaseId: masterId,
            UserCaseId: userCaseIdSummary
        }),
        success: function (summaryResponse) {
            $('#myOverlaySummary').hide();

            const historyList = document.getElementById("aiHistoryList");
            const translationContainer = document.getElementById("translationLog");
            const noHistoryMessage = document.getElementById("noHistoryMessage");

            historyList.innerHTML = "";
            translationContainer.innerHTML = "";

            if (!summaryResponse || !summaryResponse.success || !summaryResponse.data || summaryResponse.data.length === 0) {
                noHistoryMessage.style.display = "block";
                return;
            }

            noHistoryMessage.style.display = "none";

            const translations = summaryResponse.data;

            translations.forEach((item, index) => {
                const div = document.createElement("div");
                div.className = "history-item";
                div.innerText = item.OrderDates || `Entry ${index + 1}`;

                div.addEventListener("click", function () {
                    document.querySelectorAll(".history-item")
                        .forEach(i => i.classList.remove("active"));

                    div.classList.add("active");

                    translationContainer.innerHTML = `
        <div class="summary-card" id="summaryCardToPrint">
            <div class="summary-date"><b>Order Dates:</b> ${item.OrderDates}</div>
            <div class="summary-content">
                <iframe class="translation-frame" style="width:100%;height:600px;border:none;"></iframe>
            </div>
                         <div class="summary-actions" style="margin-top:15px; text-align:right;">
    <button class="btn btn-sm btn-primary" onclick="printSummaryCard()">Print</button>
    <button class="btn btn-sm btn-success" onclick="openEmailModal()">E-mail</button>
</div>
        </div>
    `;

                    const iframe = translationContainer.querySelector(".translation-frame");
                    const iframeDoc = iframe.contentWindow.document;
                    iframeDoc.open();
                    iframeDoc.write(item.Translation);
                    iframeDoc.close();
                });

                historyList.appendChild(div);
            });

            // auto select first
            if (historyList.firstChild) {
                historyList.firstChild.click();
            }

            // update count badge
        //    $("#summaryResultCount").text(`(${translations.length})`);
        },
        error: function () {
            $('#myOverlaySummary').hide();
            alert("Failed to load translation history.");
        }
    });
}

// Open chatbot
$('#btnAskAI').on('click', function () {
    let selectedUrls = [];
    let MKDrivePathAITools = localStorage.getItem("pathAITools");

    if (MKDrivePathAITools) {
        selectedUrls.push(MKDrivePathAITools);
    }
    else if (!MKDrivePathAITools || MKDrivePathAITools.trim() === "") {

        $('.order-checkbox:checked').each(function () {
            const url = $(this).data('vlocalfile');
            if (url) selectedUrls.push(url);
        });
    }
    else {
        $('.order-checkbox:checked').each(function () {
            const url = $(this).data('vlocalfile');
            if (url) selectedUrls.push(url);
        });
    }

    if (selectedUrls.length === 0) {
        alert("Please select at least one file.");
        return;
    }

    // store all selected files globally
    window.selectedAIFiles = selectedUrls;

    $('#askAIModal').show();
    $('#aiQueryInput').focus();
});

// Close chatbot
$('#closeAskAI').on('click', function () {
    $('#askAIModal').hide();
});

$('#sendAIQuery').on('click', async function () {
    GetAIToolsQuota();
    if (TotalUsedQuota >= totalQuotaAITools) {
        alert("Your AI Tools quota has been exhausted.");
        return;
    }

    if (TotalUsedQuota + 5 >= totalQuotaAITools) {
        alert("Your AI Tools quota is not sufficient to process this request.");
        $('#myOverlaySummary').hide();
        return;
    }
    const query = $('#aiQueryInput').val().trim();
    const fileUrls = window.selectedAIFiles || [];

    if (!query) return;

    // append user msg
    $('#aiChatBody').append(`<div class="ai-msg ai-user">${query}</div>`);
    $('#aiQueryInput').val('');
    $('#aiChatBody').scrollTop($('#aiChatBody')[0].scrollHeight);

    try {
        $('#aiChatBody').append(`<div class="ai-msg ai-bot">Thinking...</div>`);

        const payload = {
            query: query,
            session_id: "",
            file_urls: fileUrls // multiple URLs array
        };

        const response = await fetch('/Firm/AskQuestionFromFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        // remove "Thinking..."
        $('#aiChatBody .ai-bot').last().remove();

        if (result.answer) {
            let cleanedAnswer = result.answer;
            cleanedAnswer = cleanedAnswer.replace(/\[[^\]]*\.pdf[^\]]*\]/g, '');
            cleanedAnswer = cleanedAnswer.replace(/\n\s*\n/g, '\n').trim();
            const formattedHTML = marked.parse(cleanedAnswer);
            $('#aiChatBody').append(`<div class="ai-msg ai-bot">${formattedHTML}</div>`);
        } else {
            $('#aiChatBody').append(`<div class="ai-msg ai-bot">No response received.</div>`);
        }

        $('#aiChatBody').scrollTop($('#aiChatBody')[0].scrollHeight);
        InsertAIToolsQuota(totalQuotaAITools, 5, "Ask AI");

    } catch (e) {
        $('#aiChatBody .ai-bot').last().remove();
        $('#aiChatBody').append(`<div class="ai-msg ai-bot">Error fetching response.</div>`);
    }
});

