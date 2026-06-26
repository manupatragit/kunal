var fcode = localStorage.getItem("FirmCode");
var pageindex = 1, ppageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
$(document).ready(function () {

    $("#proactiveKeywordlink").attr("href", "/" + fcode + "/Keyword/Proactivealert");
    $("#proactivecaselink").attr("href", "/"+fcode+"/Keyword/ProactiveCases");

    UserSearchKeywordsQuota();
    FillKeywordCourtType();
    BindKeywordList(pageindex);
    /*Search proactive*/

    $("#btnsearch").click(function () {      

        var kquata = $("#balancequota").val();
        var response = "";
        var courttype = "", vcourt = "";
        courttype = $("#divcourt").val();       

        //validate the keyword
        if (kquata > 0) {
            var txtkeyval = $("#txtkeyword").val();
            if (txtkeyval.trim().length < 3) {
                alert("Please enter minimum 3 characters for keyword");
                $("#txtkeyword").focus();
                return false;
            }

            if (courttype == "") {
                alert("Please select Court Type");
                $("#txtkeyword").focus();
                return false;
            }

            if (courttype == "3") {
                if ($("#divcourtname").val().length > 0) {
                    vcourt = $("#divcourtname").val();
                }

                if (vcourt == "") {
                    alert("Please select Court Name");
                    $("#divcourtname").focus();
                    return false;
                }
            }
            if (courttype == "7") {
                if ($("#divcourtnamerera").val().length > 0) {
                    vcourt = $("#divcourtnamerera").val();
                }

                if (vcourt == "") {
                    alert("Please select Court Name");
                    $("#divcourtnamerera").focus();
                    return false;
                }
            }
            //end

            flag = "";
            //insert keyword
            if (confirm("Are you sure you wish to ADD this keyword!") == true) {
                var savecount = 0;

                $.ajax({
                    type: "POST",
                    url: "/Keyword/SaveKeywords?key=" + txtkeyval + "&courttype=" + courttype + "&vcourt=" + vcourt,
                    dataType: "text",
                    success: function (data) {
                        //alert(data);
                        savecount = savecount + 1;
                        //if (qclick == savecount) {
                        if (data == "exceed") {
                            alert("You have added maximum Keyword");
                            $("#txtkeyword").val('');
                        }
                        else if (data == "Success") {
                            isRenderPage = false;
                            alert("Your Keyword has been saved successfully.");
                            UserSearchKeywordsQuota();
                            FillCourt(courttype);
                            BindKeywordList(pageindex);
                            $("#txtkeyword").val('');
                            $("#divcourt").val(''); 
                            $("#divcourtname").val('');
                            document.getElementById("divcourtname-div").style.display = "none";
                            
                        }
                        else if (data == "Failed") {
                            alert("Party Name already exists.Try with another party name/court combination.");
                            $("#txtkeyword").val('');
                            $("#divcourt").val('');
                        }
                        //}
                    }
                });
            }
            else {
                $('#divcourt').val('');
                $('#txtkeyword').val('');
            }
        }
        else {
            alert("You do not have sufficient quota to add keywords");
            $('#divcourt').val('');
            $("#txtkeyword").val('');
        }

    });
    


    //Start pagination sub function
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    pageindex = page;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    BindKeywordList(pageindex);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + pageindex + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        pageindex = page;
        isRenderPage = false;
        $("#txtgopage").val("");
        BindKeywordList(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    //$("#prev").click(function () {

    //    if (pageindex > 1) {
    //        pageindex = pageindex - 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    BindKeywordList(pageindex);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + pageindex + "']").addClass("active");
    //});
    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        isRenderPage = false;
        pageindex = setPageNo;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        BindKeywordList(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#next").click(function () {
    //    if (pageindex => 1) {
    //        pageindex = pageindex + 1;
    //    }
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    BindKeywordList(pageindex);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + pageindex + "']").addClass("active");
    //});
    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        pageindex = setPageNo;
        isRenderPage = false;
        $("#txtgopage").val("");
        BindKeywordList(pageindex);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    if (goToPage > totalRecordCount) {
    //        setPageNo = 1;
    //        alert("Please enter a valid page number.");
    //        return false;
    //    }
    //    isRenderPage = true;
    //    BindKeywordList(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }

        if (goToPage > parseInt(totalPageRec)) {
            alert("Please enter a valid page number.");
            setPageNo = 1;
            return false;
        }
        isRenderPage = false;
        BindKeywordList(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    /*Pagination End*/

});

function fillReraCourt1() {
    var reracourt = "";
    $("#drpcourtname1 option").remove();
    $.ajax({
        type: "POST",
        url: "/AddCase/BindReraCourtType?reracourt=" + reracourt,
        dataType: "json",
        success: function (data) {
            $("#divcourtnamerera").html("");
            $("#divcourtnamerera").append("<option value='0'>Select Court</option>");
            for (var i = 0; i < data.length; i++) {
                if (data[i].casetype == "MHRERA") {
                    $("#divcourtnamerera").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                }
            }
        },
        error: function (data) {
        }
    });
}

function fn_OnChangeCourt(ival) {
    if (ival == "3") {
        document.getElementById("divcourtname-div").style.display = "block";
        document.getElementById("divcourtnamerera-div").style.display = "none";
        FillCourt(ival);
    } else if (ival == "7") {
        document.getElementById("divcourtname-div").style.display = "none";
        document.getElementById("divcourtnamerera-div").style.display = "block";
        fillReraCourt1();
    }
    else {
        document.getElementById("divcourtname-div").style.display = "none";
        document.getElementById("divcourtnamerera-div").style.display = "none";
    }
}

    function FillKeywordCourtType() {
       
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/Keyword/FillKeywordCourtType",
            dataType: 'json',
            success: function (response) {
                $("#divcourt").html("");
                $("#divcourt").append("<option value='' selected='selected'>Court Type</option>");

                $.each(response, function (i, b) {

                    $("#divcourt").append("<option value='" + b.CourtTypeId + "'>" + b.CourtType + "</option>");
                });

            },

            failure: function (response) {
                alert(response.responseText);

            },
            error: function (response) {
                alert(response.responseText);

            }

        });
    }
function FillCourt(id) {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/Keyword/GetCourt?courttypeId="+id,
        dataType: 'json',
        success: function (response) {
            $("#divcourtname").html("");
            $("#divcourtname").append("<option value='' selected='selected'>Select Court</option>");

            $.each(response, function (i, b) {
                if (b.CourtTypeId == "NC" || b.CourtTypeId == "NL" || b.CourtTypeId == "DT" || b.CourtTypeId == "CF" || b.CourtTypeId == "ST" || b.CourtTypeId == "CT" || b.CourtTypeId == "CI" || b.CourtTypeId == "NGT") {
                    $("#divcourtname").append("<option value='" + b.CourtTypeId + "'>" + b.CourtType + "</option>");
                }
            });

        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });
}

function UserSearchKeywordsQuota() {
    var quota = 0, AddedKeyword = 0, balancequota = 0, iapprove = 0;
    var message = "", dExpiryDate="";
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/Keyword/UserSearchKeywordsQuota",
        dataType: 'json',
        success: function (response) {
            $("#divcourtname").html(""); 
           
                quota = parseInt(response.vQuota);
                AddedKeyword = parseInt(response.addedkeyword);
                dExpiryDate = response.dExpiryDate;
                iapprove = parseInt(response.iApproved);
            if (Date.parse(dExpiryDate) < Date.parse(Date())) {
                balancequota = quota - AddedKeyword;
                //$("#lblquota").html(quota);
                //$("#lblAddedKeyword").html(AddedKeyword);
               
                const quotaText = document.getElementById('quotaText');
                quotaText.innerHTML = `<span class="pbarvalue">${balancequota}</span> of <span>${quota}</span> quotas remaining`;

                // Calculate percentage for the progress bar (adjust the formula as needed)
                const percentage = (AddedKeyword / quota) * 100;

                // Update the progress bar width
                const progressBar = document.getElementById('progressBar');
                progressBar.style.width = percentage + '%';

                $("#kquatoa").val(quota);
                $("#balancequota").val(balancequota);
                message = "Your subscription to Pro-Active Alert Service has expired. To renew reach us at contact@manupatra.com or call 0120-4014521";

                //message += "<a href=/PG/MakePayment.aspx?renewkeyplan=y&keyplanId=" + keywordPlan + "&keycount=" + quota + ">Click here for RENEW</a><br /><br />";
            }
            else {
                //if (iapprove == 0) {
                //    message = "Thank you for your interest in Proactive Alert Service subscription.<br />Our representative will contact you shortly.<br /><br />";
                //}
                balancequota = quota - AddedKeyword;
                //$("#lblquota").html(quota);
                //$("#lblAddedKeyword").html(AddedKeyword);
                const quotaText = document.getElementById('quotaText');
                quotaText.innerHTML = `<span class="pbarvalue">${balancequota}</span> of <span>${quota}</span> quotas remaining`;

                // Calculate percentage for the progress bar (adjust the formula as needed)
                const percentage = (AddedKeyword / quota) * 100;

                // Update the progress bar width
                const progressBar = document.getElementById('progressBar');
                progressBar.style.width = percentage + '%';

                // If these elements exist in your HTML, this will set their values:
                $("#kquatoa").val(quota);
                $("#balancequota").val(quota - AddedKeyword);
            }
            if (message != "") {
                alert(message);
            }
        },

        failure: function (response) {
            alert(response.responseText);

        },
        error: function (response) {
            alert(response.responseText);

        }

    });
    
}
   /*Bind keyword list*/
var totalRecordCount = 1;
function BindKeywordList(pageindex) {
   // document.getElementById('pagenatedArea').style.display = 'none';
    var htmls = '';        
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    pagesize = 10;
    formData.append("pagesize", pagesize);

    $.ajax(
        {
            async: true,
            type: "POST",
            //url: "/api/IPRApi/ViewAddedTradeMarkDetails",
            url: "/Keyword/GetKeywordListByUser",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,

            success: function (response1) {
                //$("#exportrecords").val(0);
                var obj = response1;
                var length = obj.length;
                var obj1 = obj;
                var qty = 0;
                if (length > 0) {
                    document.querySelector(".pagination").style.display = "flex";
                   // document.getElementById('pagenatedArea').style.display = 'block';
                   // $("#bindKeywordData tr").remove();
                    $.each(response1, function (i, val) {
                         //alert(val.RowId);

                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        var totpage = 0;
                        if (i === (length - 1)) {
                            var totdata = val.TotalRecord

                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#next').hide();
                                $('#prev').css("display", "block"); s
                            }
                            else {
                                $('#next').css("display", "block");
                            }
                            if (pageindex == 1) {
                                $('#prev').css("display", "none");
                            }
                            else {
                                $('#prev').css("display", "block");
                            }
                            // closeload();
                        }
                        qty = qty + 1;

                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var activetext = "";
                        if (role == "1") {
                            if (val.isActive == "1") {
                                activetext = "<a class='actenabled' title='Update Inactive' href='javascript:void' onclick='deactivate(" + val.iid + ",0)'>Enabled</a>";
                            } else {
                                activetext = "<a class='actdisabled' title='Update Active' href='javascript:void' onclick='deactivate(" + val.iid + ",1)'>Disabled</a>";
                            }
                        }
                        htmls += ' <tr><td style="text-align: left;">' + val.RowId + '</td><td style="text-align: left;">' + val.ddate + '</td><td>' + val.vKeyword + '</td><td><span class="courtlabel"><img src="/newassets/img/bank.png" /> ' + val.courtTypeName + '</span></td><td>' + activetext + '</td></tr>';

                        if (i === (length - 1)) {

                            if (isRenderPage == false) {
                                totalRecordCount = totpage;
                                renderPagination(pageindex, totpage);
                            }
                        }

                    });
                } else {
                    document.querySelector(".pagination").style.display = "none";

                    htmls += '<div class="notfound" id="pdatastatus" style="text-align: center;">' +
                        '<img src="/newassets/img/not-found.png" alt="Not Found">' +
                        '<h4>No Keyword list found</h4>' +
                        '<p>We found no keyword list.</p>' +
                        '</div>';
              
                }

                //  $("#districtdatabind,#alldatabind").html("");                    
                $("#bindKeywordData").html("").html(htmls);
                //closeload();
            },
            failure: function (data) {
                document.querySelector(".pagination").style.display = "none";

                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);

            }
        });
}


/*Pagination Start*/
var isRenderPage = false;
var totalPageRec = "";
var setPageNo = 1;
//function renderPagination(pageindex, totdata) {
//    let totPages = totdata;
//    totalPageRec = totdata;
//    let paginationHtml = '';
//    let maxVisible = 4; // Visible page numbers before ellipsis
//    if (totdata <= maxVisible + 2) {
//        for (let i = 1; i <= totPages; i++) {
//            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//        }
//    } else {
//        if (pageindex <= maxVisible) {
//            for (let i = 1; i <= maxVisible; i++) {
//                paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
//            }
//            paginationHtml += `<span>.......</span>`;
//            for (let j = totPages - 3; j <= totPages; j++) {
//                paginationHtml += `<button class="page-btn ${j === pageindex ? 'active' : ''}" data-page="${j}">${j}</button>`;
//            }
//        }
//    }
//    $("#pageNumbers").html(paginationHtml);
//    isRenderPage = true;
//}
function renderPagination(pageindex, totdata) {
    let totPages = totdata;
    setPageNo = pageindex;
    totalPageRec = totdata;

    let paginationHtml = '';
    let maxVisible = 4;
    let delta = 2;
    if (totPages <= maxVisible + 2) {
        for (let i = 1; i <= totPages; i++) {
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
    }
    else {
        paginationHtml += `<button class="page-btn ${pageindex === 1 ? 'active' : ''}" data-page="1">1</button>`;

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
            paginationHtml += `<button class="page-btn ${i === pageindex ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        if (end < totPages - 1) paginationHtml += `<span class="dots">...</span>`;
        paginationHtml += `<button class="page-btn ${pageindex === totPages ? 'active' : ''}" data-page="${totPages}">${totPages}</button>`;
    }
    $("#pageNumbers").html(paginationHtml);
    $("#prev").toggleClass("disabled", pageindex === 1);
    $("#next").toggleClass("disabled", pageindex === totPages);
    isRenderPage = true;
}

//Main Pagination function end

function deactivate(iid, isactive) {
    $.ajax({
        type: "POST",
        url: "/Keyword/UpdateKeywordActiveStatus?keyid=" + iid + "&status=" + isactive,
        cache: false,
        success: function (data) {
           
            if (data == "Success") {
                alert("Keyword status updated successfully");
                BindKeywordList(pageindex)
            }
            else {
                alert("Sorry! We are unable to update now. Please try after sometimes");
                return false;
            }
        }
    });
}

