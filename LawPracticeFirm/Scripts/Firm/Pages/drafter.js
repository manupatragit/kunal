

let selectedFilesdrafter = [];
let jobId = null; 


$(document).ready(function () {
    loadDrafterHistory();
    //GetAIToolsQuota();
});

function loadDrafterHistory() {
    $('#myOverlayDrafter').show();

    $.ajax({
        type: "POST",
        url: "/firm/GetAllAIDrafterDetails",
        contentType: "application/json",
        success: function (response) {
            $('#myOverlayDrafter').hide();
            if (response.success) {
                populateDrafterHistory(response.data);
            }
        },
        error: function () {
            $('#myOverlayDrafter').hide();
            $("#drafterHistory").html("<p>Error loading history.</p>");
        }
    });
}
// Open chatbot draft page
$('#getStartedAIDraft').on('click', function () {
    $('#drafterWrapper').hide();
    $('#aiDraftChatPage').show();
    $('#aiDraftInput').focus();
});

window.addEventListener("load", function () {
    localStorage.removeItem("pathDrafter");
    jobId = null;
});

//document.getElementById("attachmentDriveTab1")
//    .addEventListener("change", function () {

//        const fileInput = this;
//        if (!fileInput.files || fileInput.files.length === 0) return;

//        selectedFilesdrafter = Array.from(fileInput.files);

//        //document.getElementById("uploadedFileName").innerText = selectedFilesdrafter.map(f => f.name).join(", ");
//        //const fileInput = document.getElementById("attachmentDriveTab1");
//        const fileNameLabel = document.getElementById("uploadedFileName");
//        const clearBtn = document.getElementById("clearDrafterFileBtn");

//        document.getElementById("uploadedFileName").innerHTML = "<b>File Uploaded: </b> " + selectedFilesdrafter.map(f => f.name).join(", ");
//        clearBtn.style.display = "inline-block";

//        $('#drafterWrapper').hide();
//        $('#aiDraftChatPage').show();
//        $('#aiDraftInput').focus();

//        clearBtn.addEventListener("click", function () {

//            fileInput.value = "";
//            selectedFilesdrafter = [];
//            fileNameLabel.innerText = "";
//            clearBtn.style.display = "none";

//            $('#aiDraftChatPage').hide();
//            $('#drafterWrapper').show();
//        });
//    });

document.getElementById("attachmentDriveTab1")
    .addEventListener("change", function () {

        const fileInput = this;
        if (!fileInput.files || fileInput.files.length === 0) return;

        selectedFilesdrafter = Array.from(fileInput.files);

        const fileNameLabel = document.getElementById("uploadedFileName");
        const clearBtn = document.getElementById("clearDrafterFileBtn");

        fileNameLabel.innerHTML = "<b>File Uploaded: </b> " + selectedFilesdrafter.map(f => f.name).join(", ");
        clearBtn.style.display = "inline-block";

        $('#drafterWrapper').hide();
        $('#aiDraftChatPage').show();
        $('#aiDraftInput').focus();
    });


document.getElementById("clearDrafterFileBtn")
    .addEventListener("click", function () {

        const fileInput = document.getElementById("attachmentDriveTab1");
        const fileNameLabel = document.getElementById("uploadedFileName");

        // Reset values
        fileInput.value = "";
        selectedFilesdrafter = [];
        fileNameLabel.innerText = "";

        this.style.display = "none";

        $('#aiDraftChatPage').hide();
        $('#drafterWrapper').show();

        $('#myOverlayDrafter').hide();
        window.location.reload();
    });


function backToDraftHome() {
    $('#aiDraftChatPage').hide();
    $('#drafterWrapper').show();
    localStorage.removeItem("pathDrafter");
    jobId = null;
    selectedFilesdrafter = [];
    window.location.reload();
}

function openAIDraftModal() {
    document.getElementById("aiDraftPromptModal").style.display = "block";
}

document.getElementById("closeAIDraftModal").onclick = function () {
    document.getElementById("aiDraftPromptModal").style.display = "none";
};

document.getElementById("btnCloseAIDraft").onclick = function () {
    document.getElementById("aiDraftPromptModal").style.display = "none";
};

window.onclick = function (event) {
    const modal = document.getElementById("aiDraftPromptModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function openMyKasePicker(event) {
    event.preventDefault();
}

document.getElementById("aiDraftInput")
    .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendDraftQuery();
        }
    });

//function appendMessage(role, text) {
//    const container = document.getElementById("aiDraftContent");

//    const msg = document.createElement("div");
//    msg.style.margin = "10px 0";
//    msg.style.maxWidth = "80%";
//    msg.style.padding = "10px 14px";
//    msg.style.borderRadius = "12px";
//    msg.style.whiteSpace = "pre-wrap";

//    if (role === "user") {
//        msg.style.marginLeft = "auto";
//        msg.style.background = "#1f2a60";
//        msg.style.color = "#fff";
//    } else {
//        msg.style.marginRight = "auto";
//        msg.style.background = "#e9ecf5";
//        msg.style.color = "#000";
//    }

//    msg.innerText = text;
//    container.appendChild(msg);
//    container.scrollTop = container.scrollHeight;

//    return msg;
//}

function appendMessage(role, text) {
    const container = document.getElementById("aiDraftContent");

    const msg = document.createElement("div");
    msg.style.margin = "10px 0";
    msg.style.maxWidth = "80%";
    msg.style.padding = "10px 14px";
    msg.style.borderRadius = "12px";
    msg.style.whiteSpace = "pre-wrap";
    msg.style.position = "relative";

    if (role === "user") {
        msg.style.marginLeft = "auto";
        msg.style.background = "#1f2a60";
        msg.style.color = "#fff";
    } else {
        msg.style.marginRight = "auto";
        msg.style.background = "#e9ecf5";
        msg.style.color = "#000";
    }

    const textNode = document.createElement("div");
    textNode.innerText = text;
    msg.appendChild(textNode);

    if (role === "bot") {

        const downloadIcon = document.createElement("span");
        downloadIcon.innerHTML = '<i class="fa fa-file-word-o" aria-hidden="true" style="margin-top:10px; font-size:36px; color:dodgerblue;"></i>';
        downloadIcon.style.cursor = "pointer";
        downloadIcon.style.marginLeft = "10px";
        downloadIcon.style.fontSize = "18px";
        downloadIcon.title = "Download as Word";

        downloadIcon.onclick = function () {
            downloadWord(text);
        };

        msg.appendChild(downloadIcon);
    }

    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    return msg;
}

async function sendDraftQuery() {
    GetAIToolsQuota();
    if (TotalUsedQuota >= totalQuotaAITools) {
        alert("Your AI Tools quota has been exhausted.");
        return;
    }
    if (TotalUsedQuota + 30 >= totalQuotaAITools) {
        alert("Your AI Tools quota is not sufficient to process this request.");
        $('#myOverlaySummary').hide();
        return;
    }
    const input = document.getElementById("aiDraftInput");
    const query = input.value.trim();
    if (!query) return;

    appendMessage("user", query);
    const generatingMsg = appendMessage("bot", "Generating...");

    input.value = "";

    try {
        const formData = new FormData();
        formData.append("query", query);
        formData.append("top_k", "5");
        formData.append("search_mode", "hybrid");
        formData.append("alpha", "0.5");
        formData.append("context", "");
        let queryType = "normal";
        // Handle type logic
        if (jobId) {
            formData.append("job_id", jobId);
            formData.append("type", "refine");
            queryType = "refine";
        } else {
            formData.append("type", "normal");
        }

        const storedPath = localStorage.getItem("pathDrafter");

        if (storedPath) {
            try {
                // Fetch file from path
                const response = await fetch(storedPath);
                const blob = await response.blob();

                // Extract file name from path
                const fileName = storedPath.split('/').pop();

                // Convert Blob to File
                const file = new File([blob], fileName, { type: blob.type });

                formData.append("files", file);

                // If first time and no jobId
                if (!jobId) {
                    formData.set("type", "with_files");
                    queryType = "with_files";
                }

            } catch (fileErr) {
                console.error("Error loading file from path:", fileErr);
            }
        }

        else if (selectedFilesdrafter && selectedFilesdrafter.length > 0) {
            selectedFilesdrafter.forEach(file => {
                formData.append("files", file);
            });

            if (!jobId) {
                formData.set("type", "with_files");
                queryType = "with_files";
            }
        }

        const res = await fetch('/Firm/GenerateDraft', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.job_id) {
            jobId = data.job_id;
        }

        generatingMsg.innerText = data.draft || "No draft generated.";
        const generatedDraft = data.draft || "No draft generated.";
        generatingMsg.innerText = generatedDraft;

        if (generatedDraft !== "Generating...") {

            const downloadIcon = document.createElement("span");
            downloadIcon.innerHTML = '<i class="fa fa-file-word-o" aria-hidden="true" style="margin-top:10px; font-size:36px; color:dodgerblue;"></i>';
            downloadIcon.style.cursor = "pointer";
            downloadIcon.style.marginLeft = "10px";
            downloadIcon.style.fontSize = "18px";
            downloadIcon.title = "Download as Word";

            downloadIcon.onclick = function () {
                downloadWord(generatedDraft);
            };

            generatingMsg.appendChild(downloadIcon);
        }

        await saveDraftToHistory(query, queryType, generatedDraft, jobId);

        InsertAIToolsQuota(totalQuotaAITools, 30, "Drafter");

    } catch (err) {
        console.error(err);
        generatingMsg.innerText = "Error generating draft.";
    }
}

async function saveDraftToHistory(draftQuery, queryType, resultDraft, jobId) {

    try {
        const payload = {
            DraftQuery: draftQuery,
            QueryType: queryType,
            ResultDraft: resultDraft,
            JobId: jobId
        };

        const response = await fetch('/Firm/SaveAIDrafterDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!result.success) {
            console.error("Save failed:", result.message);
        }

    } catch (error) {
        console.error("Error saving draft history:", error);
    }
}

function populateDrafterHistory(data) {

    if (!data || data.length === 0) {
        $("#drafterHistory").html("<p>No history found.</p>");
        return;
    }

    // Group by Date (yyyy-mm-dd)
    var grouped = {};

    data.forEach(function (item) {
        var timestamp = parseInt(item.CreatedOn.replace(/\/Date\((\d+)\)\//, "$1"));
        var date = new Date(timestamp).toISOString().split('T')[0];

        if (!grouped[date]) {
            grouped[date] = [];
        }

        grouped[date].push(item);
    });

    var html = "";

    Object.keys(grouped).sort().reverse().forEach(function (date, index) {

        var toggleId = "toggle_" + index;

        html += `
                <div style="margin-bottom:8px;">
                    <div style="cursor:pointer; font-weight:bold; color:#2c3e50;font-size: 1.9rem;"
                         onclick="$('#${toggleId}').slideToggle();">
                        ${date}
                    </div>
                    <div id="${toggleId}" style="display:none; margin-left:10px; margin-top:5px;">
            `;

        grouped[date].forEach(function (entry) {
            html += `
                    <div class="drafter-item"
                        data-jobid="${entry.Job_Id}"
                        title="${entry.DraftQuery}"
                        style="cursor:pointer;
                               padding:4px 0;
                               border-bottom:1px solid #eee;
                               font-size:1.2rem;
                               white-space:nowrap;
                               overflow:hidden;
                               text-overflow:ellipsis;
                               max-width:250px;">
                        ${entry.DraftQuery}
                    </div>
                `;
        });

        html += `
                    </div>
                </div>
            `;
    });

    $("#drafterHistory").html(html);  
    $(".drafter-item").on("click", function () {
        var selectedJobId = $(this).data("jobid");
        loadDraftByJobId(selectedJobId);
        jobId = selectedJobId;
    });
}

function loadDraftByJobId(jobIdValue) {
    $('#myOverlayDrafter').show();

    fetch('/Firm/GetAIDrafterDetailsByJobId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ JobId: jobIdValue })
    })
        .then(res => res.json())
        .then(response => {
            $('#myOverlayDrafter').hide();

            if (response.success && response.data.length > 0) {
                $('#drafterWrapper').hide();
                $("#aiDraftChatPage").show();
                $("#aiDraftContent").html("");
                response.data.forEach(function (item) {

                    appendMessage("user", item.DraftQuery);
                    appendMessage("bot", item.ResultDraft);

                });

                jobId = jobIdValue;
                $("#aiDraftInput").focus();
            }
        })
        .catch(err => {
            $('#myOverlayDrafter').hide();
            console.error("Error loading draft:", err);
        });
}

function downloadWord(text) {

    var htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office'
        xmlns:w='urn:schemas-microsoft-com:office:word'>
        <head><meta charset='utf-8'></head>
        <body>${text.replace(/\n/g, "<br>")}</body>
        </html>
    `;

    var blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
    });

    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = "AIDraft.doc";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
}

//function filterDrafterHistory() {

//    var input = document.getElementById("drafterSearch").value.toLowerCase();
//    var items = document.querySelectorAll("#drafterHistory .drafter-item");

//    items.forEach(function (item) {

//        var text = item.innerText.toLowerCase();

//        if (text.includes(input)) {
//            item.style.display = "";
//        } else {
//            item.style.display = "none";
//        }
//    });

//}

function filterDrafterHistory() {

    var input = document.getElementById("drafterSearch").value.toLowerCase();

    var dateBlocks = document.querySelectorAll("#drafterHistory > div");

    dateBlocks.forEach(function (block) {

        var items = block.querySelectorAll(".drafter-item");
        var toggleDiv = block.querySelector("div[id^='toggle_']");
        var hasVisibleItem = false;

        items.forEach(function (item) {

            var text = item.innerText.toLowerCase();

            if (text.includes(input)) {
                item.style.display = "";
                hasVisibleItem = true;
            } else {
                item.style.display = "none";
            }
        });

        block.style.display = hasVisibleItem ? "" : "none";

        if (toggleDiv) {
            toggleDiv.style.display = hasVisibleItem ? "block" : "none";
        }
    });
}