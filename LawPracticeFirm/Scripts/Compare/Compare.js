$(document).ready(function () {
    var ecpageindex = 1, ecpagesize = 10;
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    LoadExpenseData(ecpageindex)
    /*Load expense details on button click*/
    $(document).on('click', '#btnsearch', function () {
        /* your code here */
        $("#btnsearch").hide();
        $("#clearnewseach").show();
        LoadExpenseData(ecpageindex);
    });
    $(document).on('click', '#btnsearchBydate', function () {
        /* your code here */
        $("#btnsearchBydate").hide();
        $("#clearDateseach").show();
        LoadExpenseData(ecpageindex);
    });
    /*Clear name, from date, to date*/
    $(document).on('click', '#clearnewseach', function () {
        /* your code here */
        $("#btnsearch").show();
        $("#clearnewseach").hide();
        $("#btnsearchBydate").show();
        $("#clearDateseach").hide();
        $("#name,#datefrom,#dateto").val("");
        LoadExpenseData(ecpageindex);
    });

    $(document).on('click', '#clearDateseach', function () {
        /* your code here */
        $("#btnsearch").hide();
        $("#clearnewseach").show();
        $("#btnsearchBydate").show();
        $("#clearDateseach").hide();
        $("#name,#datefrom,#dateto").val("");
        LoadExpenseData(ecpageindex);
    });

    function renderComparison(comparisonData) {
        document.getElementById('comparisonContainer').style.display = 'flex';

        renderPageStructure('primary');
        renderPageStructure('secondary');

        const p1 = waitForImagesToLoad(document.getElementById('primaryContent'));
        const p2 = waitForImagesToLoad(document.getElementById('secondaryContent'));

        Promise.all([p1, p2]).then(() => {
            drawAllWordBoxes();
        }).catch(err => {
            console.error("Error loading document images:", err);
            resetApp();
            showError("A problem occurred rendering the documents. Please try again.");
        });
        document.getElementById('comparemodal').style.display = 'block';
        $("#comparemodal").show();
    }
    function renderPageStructure(side) {
        const container = document.getElementById(`${side}Content`);
        container.innerHTML = '';
        const images = comparisonData[`${side}_images`] || [];
        images.forEach((src, i) => {
            const page = document.createElement('div');
            page.className = 'document-page';
            page.dataset.page = i;
            const img = document.createElement('img');
            img.src = src;
            page.appendChild(img);
            container.appendChild(page);
        });
    }

    function waitForImagesToLoad(container) {
        const images = Array.from(container.getElementsByTagName('img'));
        const promises = images.map(img =>
            new Promise((resolve, reject) => {
                if (img.complete && img.naturalHeight !== 0) resolve();
                else {
                    img.onload = resolve;
                    img.onerror = reject;
                }
            })
        );
        return Promise.all(promises);
    }

    function drawAllWordBoxes() {
        if (!comparisonData) return;
        drawWordBoxesForSide('primary');
        drawWordBoxesForSide('secondary');
    }
    function drawWordBoxesForSide(side) {
        const container = document.getElementById(`${side}Content`);
        container.querySelectorAll('.highlight-box').forEach(box => box.remove());

        // Ensure word_map works both ways
        if (comparisonData && comparisonData.word_map) {
            for (const [key, value] of Object.entries(comparisonData.word_map)) {
                if (value && !comparisonData.word_map[value]) {
                    comparisonData.word_map[value] = key;
                }
            }
        }
        const wordsByPage = (comparisonData[`${side}_words`] || []).reduce((acc, w) => {
            (acc[w.page] = acc[w.page] || []).push(w);
            return acc;
        }, {});
        for (const pageIndex in wordsByPage) {
            const page = container.querySelector(`.document-page[data-page="${pageIndex}"]`);
            if (!page) continue;

            const img = page.querySelector('img');
            if (!img || img.naturalWidth === 0) continue;

            const scale = img.width / img.naturalWidth;

            wordsByPage[pageIndex].forEach(w => {
                const [x0, y0, x1, y1] = w.bbox;
                const box = document.createElement('div');

                const hasMatch = !!comparisonData.word_map[w.id];

                // Add base highlight class depending on match state
                if (!hasMatch) {
                    box.className = `highlight-box unmatched-${side}`;
                } else {
                    box.className = `highlight-box state-${w.state}`;
                }

                box.dataset.id = w.id;
                box.style.left = `${x0 * scale}px`;
                box.style.top = `${y0 * scale}px`;
                box.style.width = `${(x1 - x0) * scale}px`;
                box.style.height = `${(y1 - y0) * scale}px`;

                // Attach click handler for matched words only
                if (hasMatch) {
                    box.addEventListener('click', handleWordClick);
                }

                page.appendChild(box);
            });
        }
    }

    function handleWordClick(event) {
        const clickedBox = event.target.closest('.highlight-box');
        if (!clickedBox || !comparisonData) return;

        // Clear previous highlights and animations
        document.querySelectorAll('.clicked, .clicked-target').forEach(el => {
            el.classList.remove('clicked', 'clicked-target');
        });

        const clickedId = clickedBox.dataset.id;
        const mappedId = comparisonData.word_map[clickedId];

        // Highlight the box that was clicked
        clickedBox.classList.add('clicked');

        // If a corresponding word exists in the other document...
        if (mappedId) {
            const targetBox = document.querySelector(`.highlight-box[data-id="${mappedId}"]`);
            if (targetBox) {
                // Highlight the target box as well
                targetBox.classList.add('clicked');

                // Add the animation class to make it "pulse"
                targetBox.classList.add('clicked-target');

                // Scroll the target into view
                targetBox.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

                // Remove the animation class after it finishes so it can be re-triggered
                setTimeout(() => {
                    targetBox.classList.remove('clicked-target');
                }, 1000); // Must match the animation duration in CSS
            }
        }
    }

    /*Load expense details*/
    function LoadExpenseData(ecpageindex) {
        $("#ecfooterexp").empty();
        var html3 = ''; var tfot = ''; var tfot1 = '';
        var formdata = new FormData();
        var name = $('#name').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        formdata.append("name", EncodeText(name));
        formdata.append("datefrom", EncodeText(datefrom));
        formdata.append("dateto", EncodeText(dateto));
        formdata.append("pagenum", EncodeText(ecpageindex));
        formdata.append("pagesize", EncodeText(ecpagesize));
        openload();
        var sct1 = $.ajax({
            async: true,
            type: "POST",
            url: "/Compare/CompareDocumentList",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1 != "") {
                    $("#ecfootercompare").empty();
                    var length = response1.length;
                    $.each(response1, function (i, a) {
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
                        //if (i === (length - 1)) {
                        //    var pnext = ecpageindex;
                        //    var pprev = ecpageindex;
                        //    var pageno = ecpageindex;
                        //    var totdata = a.totRow;
                        //    var totpage = 0;
                        //    if (a.totRow > 0) {
                        //        pnext = parseInt(pnext) + 1;
                        //        if (pnext == 0) pnext = 1;
                        //        pprev = parseInt(pageno) - 1;
                        //        if (pprev == 0) pprev = 1;
                        //        totpage = parseInt(totdata) / parseInt(ecpagesize);
                        //        if (parseInt(totdata) % parseInt(ecpagesize) != 0) {
                        //            totpage = parseInt(totpage) + 1;
                        //        }
                        //        $("#comparecpagnumvalue").attr("max", totpage);
                        //    }
                        //    tfot += '<li>results <span>' + totdata + '</span>  <span id="comparesotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + ecpageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="comparecpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="comparecgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        //    tfot += '<li>'
                        //    if (a.totRow <= length) { }
                        //    else if (pageno == 1) { }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="comparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="comparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a id="comparepaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span>'
                        //    }
                        //    $("#ecfootercompare").append(tfot);
                        //}

                        if (i === (length - 1)) {
                            $("#comparecpagnumvalue").val(a.totRow);
                            var totdata = a.totRow;
                            var totpage = 0;
                            totpage = parseInt(totdata) / parseInt(ecpagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (ecpageindex == totpage) {
                                $('#next').hide();
                                $('#prev').css("display", "block");
                            }
                            else {
                                $('#next').css("display", "block");
                            }
                            if (ecpageindex == 1) {
                                $('#prev').css("display", "none");
                            }
                            else {
                                $('#prev').css("display", "block");
                            }
                            if (isRenderPage == false) {
                                setTotalRecord = totpage;
                                renderPagination(ecpageindex, totpage);
                            }
                        }


                        var Date = a.dDate;
                        var vCompName = a.vCompName;
                        var vFCompURL = a.vFCompURL;
                        var dexpiryDate = a.expiryDate;
                        var compId = a.uCGuid;
                        var delComparedoc = '<a data-toggle="tab" href="#" id="delComparedoc" onclick=fn_DeleteComparedoc("' + compId + '")><span class="glyphicon glyphicon-trash" style="color:red;"></span></a>';
                        html3 += '<tr>'
                        html3 += '<td class="eDate">'
                        html3 += '' + Date + ''
                        html3 += '</td>'
                        html3 += '<td class="vCompName">'
                        html3 += '<span id="vCompName" ><img src="/newassets/img/pdf-icon.png" /> ' + vCompName + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="vFCompURL">'
                        //if (a.linkexpired == '0') {
                        //    html3 += '<ul class="table_action"><li><span id="vFCompURL"><a class="taskoutboxbtnicon" id="view" data-val=' + vFCompURL + '> <img src="/newassets/img/eye.svg"> </a> </li> <li><a class="taskoutboxbtnicon" href="#" id="DeleteComparedoc" data-val=' + compId + '> <img src="/newassets/img/delete.svg"></a> </li></ul>'
                        //} else {
                        //    html3 += '<ul class="table_action"><li><div class="status_badge1" id="vFCompURL"> <span class="rejected_badge"></span> Expired </div> </li> <li> <a class="taskoutboxbtnicon" href="#" id="DeleteComparedoc" data-val=' + compId + '> <img src="/newassets/img/delete.svg" /> </a></li></ul>'

                        //}

                        if (a.linkexpired == '0') {
                            html3 += '';
                        } else {
                            html3 += '<ul class="table_action"><li><div class="status_badge1" id="vFCompURL"> <span class="rejected_badge"></span> Expired </div> </li></ul>'

                        }
                        html3 += '</td>'
                        html3 += '<td class="dexpiryDate">'
                        html3 += '' + dexpiryDate + ''
                        html3 += '</td>'
                        html3 += '<td class="vFCompURL">'
                        if (a.linkexpired == '0') {
                            html3 += '<ul class="table_action" style="justify-content:flex-start;"><li><span id="vFCompURL"><a class="taskoutboxbtnicon" id="view" data-val=' + vFCompURL + '> <img src="/newassets/img/eye.svg"> </a> </li> <li><a class="taskoutboxbtnicon" href="#" id="DeleteComparedoc" data-val=' + compId + '> <img src="/newassets/img/delete.svg"></a> </li></ul>'
                        } else {
                            html3 += '<ul class="table_action" style="justify-content:flex-start;"><li> <a class="taskoutboxbtnicon" href="#" id="DeleteComparedoc" data-val=' + compId + '> <img src="/newassets/img/delete.svg" /> </a></li></ul>'
                        }
                        html3 += '</td>'
                        //html3 += '<td> </td>'
                        //html3 += '<p>Action button here</p>'  
                        //html3 += '</td>'
                        html3 += '</tr>'
                    });
                    $("#doclist").html(html3);
                    closeload();
                }
                else {
                    html3 = '<tr><td colspan=11>No result found !</td></tr>'
                    $("#bindexpense").html(html3);
                    closeload();
                }
            },
            failure: function (response1) {
                alert(response1.responseText);
                closeload();
            },
            error: function (response1) {
                alert(response1.responseText);
                closeload();
            }
        });
        /*Pagination Start*/
        var isRenderPage = false;
        var totalPageRec = "";
        function renderPagination(pageindex, totdata) {
            let totPages = totdata;
            setPageNo = pageindex;
            totalPageRec = totdata;
            let paginationHtml = '';
            let maxVisible = 4; // Visible page numbers before ellipsis
            if (totdata <= maxVisible + 2) {
                for (let i = 1; i <= totPages; i++) {
                    paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
            } else {
                if (pageindex <= maxVisible) {
                    for (let i = 1; i <= maxVisible; i++) {
                        paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
                    }
                    paginationHtml += `<span>.......</span>`;
                    for (let j = totPages - 3; j <= totPages; j++) {
                        paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
                    }
                }
            }
            $("#pageNumbers").html(paginationHtml);
            isRenderPage = true;
        }
        var setPageNo = 1;
        $(document).on("click", ".page-btn", function () {
            let page = $(this).data("page");
            setPageNo = page;
            isRenderPage = true;
            $("#txtgopage").val("");
            LoadExpenseData(setPageNo);

            $(".page-btn").removeClass("active");
            $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
        });
        $(document).on("click", "#prev", function () {
            if (setPageNo > 1) {
                setPageNo = setPageNo - 1;
            }
            loadflag = true;
            isRenderPage = true;
            $("#txtgopage").val("");
            LoadExpenseData(setPageNo);
            $(".page-btn").removeClass("active");
            $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
        });
        $(document).on("click", "#next", function () {
            if (setPageNo => 1) {
                setPageNo = setPageNo + 1;
            }
            isRenderPage = true;
            $("#txtgopage").val("");
            LoadExpenseData(setPageNo);
            $(".page-btn").removeClass("active");
            $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
        });
        $(document).on("click", "#divGo", function () {
            let goToPage = parseInt($("#txtgopage").val());
            if (!isNaN(goToPage)) {
                setPageNo = goToPage;
            }
            if (goToPage > setTotalRecord || goToPage == 0 || isNaN(goToPage)) {
                alert("Please enter a valid page number.");
                setPageNo = 1;
                return false;
            }
            isRenderPage = true;
            LoadExpenseData(setPageNo);
            $(".page-btn").removeClass("active");
            $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
        });
        /*Pagination End*/
        $("#ColumnSelectionopen").click(function () {
            $('#myModalCustomizedcolumn').modal({ show: true });
        });


        $(document).on('click', '#view', function () {
            var url = $(this).attr("data-val"); // token is actually a URL

            // Fetch the data from the URL
            fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok");
                    return response.json();
                })
                .then(parsedData => {
                    comparisonData = parsedData;

                    renderComparison(comparisonData);
                })
                .catch(error => {
                    console.error("Error fetching comparison data:", error);
                });
        });

        $(document).on('click', '#mclose', function () {
            $("#comparemodal").hide();
        });
        function ModalClose() {
            document.getElementById("showMe").style.display = "none";
        }
        $.when(sct1).then(function (data, textStatus, jqXHR) {
            $("#EColli li input:checkbox:not(:checked)").each(function () {
                var column = "#cexample1 ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    $(document).on('change', '.chkdhide', function () {
        // your code
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
    /*Delete compare document*/
    $(document).on('click', '#DeleteComparedoc', function () {
        if (confirm("Are you sure want to delete this file!")) {
            var uCGuid = $(this).attr("data-val");
            var formData = new FormData();
            formData.append("uCGuid", EncodeText(uCGuid));
            $.ajax({
                async: true,
                type: "POST",
                url: "/Compare/RemoveCompareDoc",
                dataType: 'text',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (response1 == "Success") {
                        alert("Successfully deleted");
                        LoadExpenseData(ecpageindex);
                        loadquata();
                    }
                    else if (response1 == "error") {
                        alert("Oops! Something went wrong..");
                    }
                }
            });
        }
    });
    /*Load expense data by page number*/
    $(document).on('click', '#comparecgetpagnumvalue', function () {
        ecpageindex = $("#comparecpagnumvalue").val();
        if (ecpageindex != "undefined") {
            if (Math.sign(ecpageindex) == 1) {
                var pageindesx = $("#comparesotopage").text();
                if (ecpageindex <= parseInt(pageindesx)) {
                    openload();
                    LoadExpenseData(ecpageindex);
                    closeload();
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
    /*Load expense details by page number*/
    $(document).on('click', '#comparepaginate', function () {
        /* your code here */
        ecpageindex = $(this).attr("index");
        LoadExpenseData(ecpageindex);
    });
    /*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    /*Export expense report in excel*/
    $('#expenseexcel').click(function () {
        var ddlExpenceClient = $('#ddlExpenceClient').val();
        var ddlExpenceCase = $('#ddlExpenceCase').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        var loginid = $("#ddlExpUser").val();
        var expensetype = $("#ddlExpenseType").val();
        var category = $("#ddlCategory").val();
        var createdfor = $("#ddlExpenceTeamMemberCr").val();
        window.location = encodeURI("/Report/ExportoExcelExpenseReport?pagenum=" + pageindex + "&pagesize=" + pagesize + "&datefrom=" + datefrom + "&dateto=" + dateto + "&loginid=" + loginid);
    });
    /*Export expense report in pdf*/
    $('#expensepdf').click(function () {
        var ddlExpenceClient = $('#ddlExpenceClient').val();
        var ddlExpenceCase = $('#ddlExpenceCase').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        var loginid = $("#ddlExpUser").val();
        var expensetype = $("#ddlExpenseType").val();
        var category = $("#ddlCategory").val();
        var createdfor = $("#ddlExpenceTeamMemberCr").val();
        window.location = encodeURI("/Report/ExportoPdfExpenseReport?pagenum=" + pageindex + "&pagesize=" + pagesize + "&datefrom=" + datefrom + "&dateto=" + dateto + "&loginid=" + loginid);
    });
    loadquata();
    /*Load quata details*/
    function loadquata() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/Compare/CompareDocQuota",
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1 && response1.length > 0) {
                    $.each(response1, function (i, a) {
                        const total = parseInt(a.totdoc) || 0;
                        const used = parseInt(a.usedtotdoc) || 0;
                        const left = parseInt(a.leftdoc) || 0;
                        const deleted = parseInt(a.deleteddoc) || 0;

                        $('#totdoc').html(total);
                        $('#totuseddoc').html(used);
                        $('#totleftdoc').html(left);
                        $('#totdeleteddoc').html(deleted);

                        const quotaText = document.getElementById('quotaText');
                        quotaText.innerHTML = `<span class="pbarvalue">${left}</span> of <span>${total}</span> remaining`;
                        const percentage = total > 0 ? (used / total) * 100 : 0;
                        const progressBar = document.getElementById('progressBar');
                        progressBar.style.width = percentage + '%';
                        progressBar.setAttribute('aria-valuenow', used);

                        const quotaValueForCompare = total - used;
                        localStorage.setItem("quotaValueForCompare", quotaValueForCompare)



                        $('#kquatoa').val(total);
                        $('#balancequota').val(left);
                    });
                }
            },
            failure: function (data) {
            },
            error: function (data) {
            }
        });
    }
    /*Delete compare document*/
    function fn_DeleteComparedoc(uCGuid) {
        if (confirm("Are you sure want to delete this document!")) {
            var formData = new FormData();
            formData.append("uCGuid", EncodeText(uCGuid));
            $.ajax({
                async: true,
                type: "POST",
                url: "/Compare/RemoveCompareDoc",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    if (response1.Data == "Success") {
                        alert("Successfully deleted");
                        ViewCaseRoleAccess(pageindex);
                        loadquata();
                    }
                    else if (response1.Data == "error") {
                        alert("Oops! Something went wrong..");
                    }
                }
            });
        }
    }
});
