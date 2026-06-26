$(document).ready(function () {
    jQuery('#actcontacttype').multiselect({
        columns: 1,
        search: true,
        selectAll: true
    });
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var pageindex1 = 1, pagesize1 = 10, recordcount1 = 0, totrecord1 = 0;
    var pageindex2 = 1, pagesize2 = 10, recordcount2 = 0, totrecord2 = 0;
    var pageindex3 = 1, pagesize3 = 10, recordcount3 = 0, totrecord3 = 0;
    var pageindex4 = 1, pagesize4 = 10, recordcount4 = 0, totrecord4 = 0;
    const users = [
        {id: "2", RoleName: " Matter Name" },
        {id: "4", RoleName: "Petitioner " },
        {id: "5", RoleName: "Respondent " },
        {id: "6", RoleName: "Company" },
        {id: "1", RoleName: "Client Contact" },
        {id: "9", RoleName: "Other Party" }



    ];

    // Desired role to match

    // Loop through the static array
    $.each(users, function (i, a) {
        const option = `<option value="${a.id}">${a.RoleName}</option>`;
        $("#actcontacttype").append(option);
    });
    $("#actcontacttype").multiselect('reload');


    $(document).on('click', '#paginate', function () {
        var chksearchs = $("#myinput").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $(this).attr("index");
        ConflictSearch(pageindex);
    });

    /*Get data by page number*/
    $(document).on('click', '#getdatabypagenum', function () {
        pageindex = $("#pagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage").text();
                if (pageindex <= parseInt(pageindesx)) {
                    ConflictSearch(pageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    $(document).on('click', '#paginate1', function () {
        /* your code here */
        var chksearchs = $("#myinput1").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $(this).attr("index");
        ConflictSearchlPlaintiff(pageindex);
    });
    $(document).on('click', '#getdatabypagenum1', function () {
        pageindex = $("#pagnumvalue1").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage1").text();
                if (pageindex <= parseInt(pageindesx)) {
                    ConflictSearchlPlaintiff(pageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    $(document).on('click', '#paginate2', function () {
        var chksearchs = $("#myinput2").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $(this).attr("index");
        ConflictSearchlDefendant(pageindex);
    });
    $(document).on('click', '#getdatabypagenum2', function () {
        pageindex = $("#pagnumvalue2").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage2").text();
                if (pageindex <= parseInt(pageindesx)) {
                    ConflictSearchlDefendant(pageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    $(document).on('click', '#paginate3', function () {
        var chksearchs = $("#myinput3").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $(this).attr("index");
        ConflictSearchlCoparties(pageindex);
    });
    /*Get data by page number 3*/
    $(document).on('click', '#getdatabypagenum3', function () {
        pageindex = $("#pagnumvalue3").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage3").text();
                if (pageindex <= parseInt(pageindesx)) {
                    ConflictSearchlCoparties(pageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });

    /*Paginate*/
    $(document).on('click', '#paginate4', function () {
        var chksearchs = $("#myinput4").val();
        if (chksearchs != "") {
            searchflag = true;
        }
        pageindex = $(this).attr("index");
        ConflictSearchlClientPartner(pageindex);
    });
    $(document).on('click', '#getdatabypagenum4', function () {
        pageindex = $("#pagnumvalue4").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var pageindesx = $("#sotopage4").text();
                if (pageindex <= parseInt(pageindesx)) {
                    ConflictSearchlClientPartner(pageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                }
            }
            else {
                alert("Please enter a valid page number.");
            }
        }
    });
    /*Clear search*/
    $("#clearnewseach").click(function () {
        isRenderPage = false;
        $("#searchdata").val("");
     //   $(".checkboxsearch,#select_all").prop('checked', false);
        // Loop through the static array
        $("#actcontacttype").html("");
        $("#actcontacttype option").remove();
        $.each(users, function (i, a) {
            const option = `<option value="${a.id}">${a.RoleName}</option>`;
            $("#actcontacttype").append(option);
        });
        $("#actcontacttype").multiselect('reload');

        $("#clearnewseach").css("display", "none");
        $("#statusdiv").html("").hide();
        ConflictSearch(pageindex);
    })
    $("#btnsearch").click(function () {
        isRenderPage = false;
        var arr = [];
        var sdata = $("#searchdata").val();
        if (sdata == "") {
            alert("Please enter text to search");
            $("#searchdata").focus();
            return false;
        }
        $('input:checkbox.checkboxsearch').each(function () {
            var sThisVal = (this.checked ? $(this).val() : "");
            arr.push(sThisVal);
        });
        if (JSON.stringify(arr) == '["","","","","","","",""]') {
            alert("Please tick atleast one field");
            return false;
        }
       // $("#btnsearch").attr("disabled", true);
        ConflictSearch(pageindex);
        $("#clearnewseach").css("display", "unset");
    })

    /*Search cnflict by page index*/
    function ConflictSearch(pageindex) {
        $("#statusdiv").html("").hide();
        $("#bindcasedata,#bindcasedatadivcount").empty();
        $("#div1").hide();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        var searchdatas = $('#searchdata').val();
        var clientsearch = "";
        var casesearch = "";
        var petiotionersrch = "";
        var respondentsrch = "";
        var companysrch = "";
        var otherpartysrch = "";

        var contactTypes = $("#actcontacttype").val();
        if (contactTypes.includes("2")) {
            casesearch = "2"
        }
        if (contactTypes.includes("4")) {
            petiotionersrch = "4"
        }
        if (contactTypes.includes("5")) {
            respondentsrch = "5"
        }
        if (contactTypes.includes("6")) {
            companysrch = "6"
        }
        if (contactTypes.includes("9")) {
            otherpartysrch = "9"
        }
        if (contactTypes.includes("1")) {
            clientsearch = "1";
        }


        formdata.append("searchdata", EncodeText(searchdatas));
        formdata.append("ClientName", EncodeText(clientsearch));
        formdata.append("CaseName", EncodeText(casesearch));
        //formdata.append("CaseNumber", EncodeText($('input[name="CaseNumber"]:checked').val()));
        formdata.append("Plaintiff", EncodeText(petiotionersrch));
        formdata.append("Defendant", EncodeText(respondentsrch));
       // formdata.append("OppositePartyCounsel", EncodeText($('input[name="OppositePartyCounsel"]:checked').val()));
       // formdata.append("OtherCoparties", EncodeText($('input[name="OtherCoparties"]:checked').val()));
      //  formdata.append("Partners", EncodeText($('input[name="Partners"]:checked').val()));
        formdata.append("companysrch", EncodeText(companysrch));
        formdata.append("otherpartysrch", EncodeText(otherpartysrch));
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        openload();
        var ct1 = $.ajax({
            async: true,
            url: '/api/ReportApi/SearchCaseDetail',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                }
                else {
                    //alert("not found");
                    closeload();
                }
                var html3 = "";
                $("#bindcasedata").empty();
                var length = response.Data.length;
                if (length > 0) {
                    $("#statusdiv").html("").hide();
                    $("#pdatastatus").hide();
                    $("#tradePagination").show();
                    //$("#casetfooter").html("");
                    $.each(response.Data, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.rownum;
                        }
                        if (i === (length - 1)) {
                            //var pnext = pageindex;
                            //var pprev = pageindex;
                            //var pageno = pageindex;
                            //var totdata = val.totRow;
                            //var totpage = 0;
                            //if (val.totRow > 0) {
                            //    pnext = parseInt(pnext) + 1;
                            //    if (pnext == 0) pnext = 1;
                            //    pprev = parseInt(pageno) - 1;
                            //    if (pprev == 0) pprev = 1;
                            //    totpage = parseInt(totdata) / parseInt(pagesize);
                            //    if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            //        totpage = parseInt(totpage) + 1;
                            //    }
                            //    $("#pagnumvalue").attr("max", totpage);
                            //}
                            //var tfot = '';
                            //tfot += '<ul>'
                            //tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            //tfot += '<li><span>|</span></li>'
                            //tfot += '<li ><input type="number" id="pagnumvalue" min="1" class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                            //if (val.totRow <= length) {
                            //}
                            //else if (pageno == 1) {
                            //}
                            //else if (pageno == totpage) {
                            //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //}
                            //else {
                            //    tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                            //}
                            //if (pageno < totpage) {
                            //    tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            //}
                            //$("#casetfooter").append(tfot);

                            var totdata = val.totRow;
                            var totpage = 0;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#next').hide();
                                $('#prev').css("display", "block");
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
                            if (isRenderPage == false) {
                                setTotalRecord = totpage;
                                renderPagination(pageindex, totpage);
                            }

                        }
                        var clienttype = "";
                        if (val.IsCompanyAdmin == "1" || val.CompanyName!="") {
                            clienttype = "Company";
                        }
                        else {
                            clienttype = "Individual";
                        }
                        html3 += '<tr><td>' + clienttype + ' </td><td>' + Removenull(val.ClientName) + ' </td><td>' + Removenull(val.mname) + ' </td><td>' + Removenull(val.mtrno) + ' </td><td>' + Removenull(val.MatterType) + ' </td><td>' + Removenull(val.TeamLeadName) + ' </td><td>' + Removenull(val.createdby) + ' </td><td>' + formatDatetoIST(val.odate) + ' </td></tr>';
                        $("#div1").show();
                        $("#bindcasedatadivcount").html(": (" + val.totRow + ")");
                    });
                    $("#bindcasedata").append(html3);
                } else {
                    //$("#statusdiv").html("No results found for your query.").show();
                    $("#pdatastatus").show();
                    $("#tradePagination").hide();
                }
               
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
        $.when(ct1).then(function (data, textStatus, jqXHR) {
        });
       // ConflictSearchlClientPartner(pageindex4);
    }


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
        ConflictSearch(setPageNo);
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
        ConflictSearch(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
    $(document).on("click", "#next", function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        isRenderPage = true;
        $("#txtgopage").val("");
        ConflictSearch(setPageNo);
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
        ConflictSearch(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });
/*Pagination End*/

    /*Conflict search*/
    //function ConflictSearchlPlaintiff(pageindex1) {
    //    $("#bindcasedata1,#bindcasedatadivcount1").empty();
    //    $("#div2").hide();
    //    var fcode = localStorage.getItem("FirmCode");
    //    var formdata = new FormData();
    //    formdata.append("searchdata", EncodeText($('#searchdata').val()));
    //    formdata.append("ClientName", EncodeText($('input[name="ClientName"]:checked').val()));
    //    formdata.append("CaseName", EncodeText($('input[name="CaseName"]:checked').val()));
    //    formdata.append("CaseNumber", EncodeText($('input[name="CaseNumber"]:checked').val()));
    //    formdata.append("Plaintiff", EncodeText($('input[name="Plaintiff"]:checked').val()));
    //    formdata.append("Defendant", EncodeText($('input[name="Defendant"]:checked').val()));
    //    formdata.append("OppositePartyCounsel", EncodeText($('input[name="OppositePartyCounsel"]:checked').val()));
    //    formdata.append("OtherCoparties", EncodeText($('input[name="OtherCoparties"]:checked').val()));
    //    formdata.append("Partners", EncodeText($('input[name="Partners"]:checked').val()));
    //    formdata.append("pagenum", EncodeText(pageindex1));
    //    formdata.append("pagesize", EncodeText(pagesize1));
    //    // openload();
    //    var ld12 = $.ajax({
    //        async: true,
    //        url: '/api/ReportApi/SearchConflictDetailPlaintiff',
    //        data: formdata,
    //        processData: false,
    //        contentType: false,
    //        type: 'POST',
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //            }
    //            else {
    //                //alert("not found");
    //            }
    //            if (response.Data == "") {
    //                $("#statusdiv1").html("No results found for your query.").show();
    //            }
    //            else {
    //                $("#statusdiv1").html("").hide();
    //            }
    //            $("#bindcasedata1").empty();
    //            var html3 = '';
    //            var length = response.Data.length;
    //            $("#casetfooter1").html("");
    //            $.each(response.Data, function (i, val) {
    //                if (i === 0) {
    //                    firstvalue = val.rownum;
    //                }
    //                if (i === (length - 1)) {
    //                    var pnext = pageindex1;
    //                    var pprev = pageindex1;
    //                    var pageno = pageindex1;
    //                    var totdata = val.totRow;
    //                    var totpage = 0;
    //                    if (val.totRow > 0) {
    //                        pnext = parseInt(pnext) + 1;
    //                        if (pnext == 0) pnext = 1;
    //                        pprev = parseInt(pageno) - 1;
    //                        if (pprev == 0) pprev = 1;
    //                        totpage = parseInt(totdata) / parseInt(pagesize1);
    //                        if (parseInt(totdata) % parseInt(pagesize1) != 0) {
    //                            totpage = parseInt(totpage) + 1;
    //                        }
    //                        $("#pagnumvalue1").attr("max", totpage);
    //                    }
    //                    var tfot = '';
    //                    tfot += '<ul>'
    //                    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage1" style="display:none">' + totpage + '</span></li>'
    //                    tfot += '<li><span>|</span></li>'
    //                    tfot += '<li>pages ' + pageindex1 + '/ ' + parseInt(totpage) + '</li>'
    //                    tfot += '<li><span>|</span></li>'
    //                    tfot += '<li ><input type="number" id="pagnumvalue1" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum1" style="margin-left:10px;cursor:pointer">Go</button> </li>'
    //                    if (val.totRow <= length) {
    //                    }
    //                    else if (pageno == 1) {
    //                    }
    //                    else if (pageno == totpage) {
    //                        tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
    //                    }
    //                    else {
    //                        tfot += '<li><span><a id="paginate1"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
    //                    }
    //                    if (pageno < totpage) {
    //                        tfot += '<a  id="paginate1" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
    //                    }
    //                    $("#casetfooter1").append(tfot);
    //                }
    //                html3 += '<tr><td>' + Removenull(val.Name) + ' </td><td>' + Removenull(val.mname) + ' </td><td>' + Removenull(val.mtrno) + ' </td><td>' + Removenull(val.cstatus) + ' </td><td>' + Removenull(val.assignuserto) + ' </td><td>' + Removenull(val.CourtName) + ' </td><td>' + Removenull(val.OtherCourtName) + ' </td><td>' + Removenull(val.MatterType) + ' </td></tr>';
    //                $("#div2").show();
    //                $("#bindcasedatadivcount1").html(": (" + val.totRow + ")");
    //            });
    //            $("#bindcasedata1").append(html3);
    //        },
    //        error: function (response) {
    //            alert(response.responseText);
    //        }
    //    });
    //    $.when(ld12).then(function (data, textStatus, jqXHR) {
    //    });
    //}
    //function ConflictSearchlDefendant(pageindex2) {
    //    $("#bindcasedata2,#bindcasedatadivcount2").empty();
    //    $("#div3").hide();
    //    var fcode = localStorage.getItem("FirmCode");
    //    var formdata = new FormData();
    //    formdata.append("searchdata", EncodeText($('#searchdata').val()));
    //    formdata.append("ClientName", EncodeText($('input[name="ClientName"]:checked').val()));
    //    formdata.append("CaseName", EncodeText($('input[name="CaseName"]:checked').val()));
    //    formdata.append("CaseNumber", EncodeText($('input[name="CaseNumber"]:checked').val()));
    //    formdata.append("Plaintiff", EncodeText($('input[name="Plaintiff"]:checked').val()));
    //    formdata.append("Defendant", EncodeText($('input[name="Defendant"]:checked').val()));
    //    formdata.append("OppositePartyCounsel", EncodeText($('input[name="OppositePartyCounsel"]:checked').val()));
    //    formdata.append("OtherCoparties", EncodeText($('input[name="OtherCoparties"]:checked').val()));
    //    formdata.append("Partners", EncodeText($('input[name="Partners"]:checked').val()));
    //    formdata.append("pagenum", EncodeText(pageindex2));
    //    formdata.append("pagesize", EncodeText(pagesize2));
    //    var ld12 = $.ajax({
    //        async: true,
    //        url: '/api/ReportApi/SearchConflictDetailDefendant',
    //        data: formdata,
    //        processData: false,
    //        contentType: false,
    //        type: 'POST',
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //            }
    //            else {
    //                //alert("not found");
    //            }
    //            if (response.Data == "") {
    //                $("#statusdiv2").html("No results found for your query.").show();
    //            }
    //            else {
    //                $("#statusdiv2").html("").hide();
    //            }
    //            $("#bindcasedata2").empty();
    //            var html3 = '';
    //            var length = response.Data.length;
    //            $("#casetfooter2").html("");
    //            $.each(response.Data, function (i, val) {
    //                if (i === 0) {
    //                    firstvalue = val.rownum;
    //                }
    //                if (i === (length - 1)) {
    //                    var pnext = pageindex2;
    //                    var pprev = pageindex2;
    //                    var pageno = pageindex2;
    //                    var totdata = val.totRow;
    //                    var totpage = 0;
    //                    if (val.totRow > 0) {
    //                        pnext = parseInt(pnext) + 1;
    //                        if (pnext == 0) pnext = 1;
    //                        pprev = parseInt(pageno) - 1;
    //                        if (pprev == 0) pprev = 1;
    //                        totpage = parseInt(totdata) / parseInt(pagesize2);
    //                        if (parseInt(totdata) % parseInt(pagesize2) != 0) {
    //                            totpage = parseInt(totpage) + 1;
    //                        }
    //                        $("#pagnumvalue2").attr("max", totpage);
    //                    }
    //                    var tfot = '';
    //                    tfot += '<ul>'
    //                    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage2" style="display:none">' + totpage + '</span></li>'
    //                    tfot += '<li><span>|</span></li>'
    //                    tfot += '<li>pages ' + pageindex2 + '/ ' + parseInt(totpage) + '</li>'
    //                    tfot += '<li><span>|</span></li>'
    //                    tfot += '<li ><input type="number" id="pagnumvalue2" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum2" style="margin-left:10px;cursor:pointer">Go</button> </li>'
    //                    if (val.totRow <= length) {
    //                    }
    //                    else if (pageno == 1) {
    //                    }
    //                    else if (pageno == totpage) {
    //                        tfot += '<li><span><a id="paginate2"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
    //                    }
    //                    else {
    //                        tfot += '<li><span><a id="paginate2"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
    //                    }
    //                    if (pageno < totpage) {
    //                        tfot += '<a  id="paginate2" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
    //                    }
    //                    $("#casetfooter2").append(tfot);
    //                }
    //                html3 += '<tr><td>' + Removenull(val.Name) + ' </td><td>' + Removenull(val.mname) + ' </td><td>' + Removenull(val.mtrno) + ' </td><td>' + Removenull(val.cstatus) + ' </td><td>' + Removenull(val.assignuserto) + ' </td><td>' + Removenull(val.CourtName) + ' </td><td>' + Removenull(val.OtherCourtName) + ' </td><td>' + Removenull(val.MatterType) + ' </td></tr>';
    //                $("#div3").show();
    //                $("#bindcasedatadivcount2").html(": (" + val.totRow + ") ");
    //            });
    //            $("#bindcasedata2").append(html3);
    //        },
    //        error: function (response) {
    //            alert(response.responseText);
    //        }
    //    });
    //    $.when(ld12).then(function (data, textStatus, jqXHR) {
    //        //closeload();
    //    });
    //}
    //function ConflictSearchlCoparties(pageindex3) {
    //    $("#bindcasedata3,#bindcasedatadivcount3").empty();
    //    $("#div4").hide();
    //    var fcode = localStorage.getItem("FirmCode");
    //    var formdata = new FormData();
    //    formdata.append("searchdata", EncodeText($('#searchdata').val()));
    //    formdata.append("ClientName", EncodeText($('input[name="ClientName"]:checked').val()));
    //    formdata.append("CaseName", EncodeText($('input[name="CaseName"]:checked').val()));
    //    formdata.append("CaseNumber", EncodeText($('input[name="CaseNumber"]:checked').val()));
    //    formdata.append("Plaintiff", EncodeText($('input[name="Plaintiff"]:checked').val()));
    //    formdata.append("Defendant", EncodeText($('input[name="Defendant"]:checked').val()));
    //    formdata.append("OppositePartyCounsel", EncodeText($('input[name="OppositePartyCounsel"]:checked').val()));
    //    formdata.append("OtherCoparties", EncodeText($('input[name="OtherCoparties"]:checked').val()));
    //    formdata.append("Partners", EncodeText($('input[name="Partners"]:checked').val()));
    //    formdata.append("pagenum", EncodeText(pageindex3));
    //    formdata.append("pagesize", EncodeText(pagesize3));
    //    // openload();
    //    var ld12 = $.ajax({
    //        async: true,
    //        url: '/api/ReportApi/SearchConflictDetailCoparties',
    //        data: formdata,
    //        processData: false,
    //        contentType: false,
    //        type: 'POST',
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //            }
    //            else {
    //                //alert("not found");
    //            }
    //            if (response.Data == "") {
    //                $("#statusdiv3").html("No results found for your query.").show();
    //            }
    //            else {
    //                $("#statusdiv3").html("").hide();
    //            }
    //            $("#bindcasedata3").empty();
    //            var html3 = '';
    //            var length = response.Data.length;
    //            $("#casetfooter3").html("");
    //            $.each(response.Data, function (i, val) {
    //                if (i === 0) {
    //                    firstvalue = val.rownum;
    //                }
    //                if (i === (length - 1)) {
    //                    var pnext = pageindex3;
    //                    var pprev = pageindex3;
    //                    var pageno = pageindex3;
    //                    var totdata = val.totRow;
    //                    var totpage = 0;
    //                    if (val.totRow > 0) {
    //                        pnext = parseInt(pnext) + 1;
    //                        if (pnext == 0) pnext = 1;
    //                        pprev = parseInt(pageno) - 1;
    //                        if (pprev == 0) pprev = 1;
    //                        totpage = parseInt(totdata) / parseInt(pagesize3);
    //                        if (parseInt(totdata) % parseInt(pagesize3) != 0) {
    //                            totpage = parseInt(totpage) + 1;
    //                        }
    //                        $("#pagnumvalue3").attr("max", totpage);
    //                    }
    //                    var tfot = '';
    //                    tfot += '<ul>'
    //                    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage3" style="display:none">' + totpage + '</span></li>'
    //                    tfot += '<li><span>|</span></li>'
    //                    tfot += '<li>pages ' + pageindex3 + '/ ' + parseInt(totpage) + '</li>'
    //                    tfot += '<li><span>|</span></li>'
    //                    tfot += '<li ><input type="number" id="pagnumvalue3" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum3" style="margin-left:10px;cursor:pointer">Go</button> </li>'
    //                    if (val.totRow <= length) {
    //                    }
    //                    else if (pageno == 1) {
    //                    }
    //                    else if (pageno == totpage) {
    //                        tfot += '<li><span><a id="paginate3"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
    //                    }
    //                    else {
    //                        tfot += '<li><span><a id="paginate3"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
    //                    }
    //                    if (pageno < totpage) {
    //                        tfot += '<a  id="paginate3" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
    //                    }
    //                    $("#casetfooter3").append(tfot);
    //                }
    //                html3 += '<tr><td>' + Removenull(val.Name) + ' </td><td>' + Removenull(val.mname) + ' </td><td>' + Removenull(val.mtrno) + ' </td><td>' + Removenull(val.cstatus) + ' </td><td>' + Removenull(val.assignuserto) + ' </td><td>' + Removenull(val.CourtName) + ' </td>';//<td>' + Removenull(val.OtherCourtName) + ' </td><td>' + Removenull(val.MatterType) + ' </td></tr>';
    //                $("#div4").show();
    //                $("#bindcasedatadivcount3").html(": (" + val.totRow + ") ");
    //            });
    //            $("#bindcasedata3").append(html3);
    //        },
    //        error: function (response) {
    //            alert(response.responseText);
    //        }
    //    });
    //    $.when(ld12).then(function (data, textStatus, jqXHR) {
    //        //closeload();
    //    });
    //}
    //function ConflictSearchlClientPartner(pageindex4) {
    //    $("#bindcasedata4,#bindcasedatadivcount4").empty();
    //    $("#div5").hide();
    //    var fcode = localStorage.getItem("FirmCode");
    //    var formdata = new FormData();
    //    formdata.append("searchdata", EncodeText($('#searchdata').val()));
    //    formdata.append("ClientName", EncodeText($('input[name="ClientName"]:checked').val()));
    //    formdata.append("CaseName", EncodeText($('input[name="CaseName"]:checked').val()));
    //    formdata.append("CaseNumber", EncodeText($('input[name="CaseNumber"]:checked').val()));
    //    formdata.append("Plaintiff", EncodeText($('input[name="Plaintiff"]:checked').val()));
    //    formdata.append("Defendant", EncodeText($('input[name="Defendant"]:checked').val()));
    //    formdata.append("OppositePartyCounsel", EncodeText($('input[name="OppositePartyCounsel"]:checked').val()));
    //    formdata.append("OtherCoparties", EncodeText($('input[name="OtherCoparties"]:checked').val()));
    //    formdata.append("Partners", EncodeText($('input[name="Partners"]:checked').val()));
    //    formdata.append("pagenum", EncodeText(pageindex4));
    //    formdata.append("pagesize", EncodeText(pagesize4));
    //    var ld12 = $.ajax({
    //        async: true,
    //        url: '/api/ReportApi/SearchConflictDetailByClientPartner',
    //        data: formdata,
    //        processData: false,
    //        contentType: false,
    //        type: 'POST',
    //        success: function (response) {
    //            if (response.Status == true) {
    //                var datas = JSON.stringify(response);
    //            }
    //            else {
    //                //alert("not found");
    //            }
    //            if (response.Data == "") {
    //                $("#statusdiv4").html("No results found for your query.").show();
    //            }
    //            else {
    //                $("#statusdiv4").html("").hide();
    //            }
    //            $("#bindcasedata4").empty();
    //            var html3 = '';
    //            var length = response.Data.length;
    //            $("#casetfooter4").html("");
    //            $.each(response.Data, function (i, val) {
    //                if (i === 0) {
    //                    firstvalue = val.rownum;
    //                }
    //                if (i === (length - 1)) {
    //                    var pnext = pageindex4;
    //                    var pprev = pageindex4;
    //                    var pageno = pageindex4;
    //                    var totdata = val.totRow;
    //                    var totpage = 0;
    //                    if (val.totRow > 0) {
    //                        pnext = parseInt(pnext) + 1;
    //                        if (pnext == 0) pnext = 1;
    //                        pprev = parseInt(pageno) - 1;
    //                        if (pprev == 0) pprev = 1;
    //                        totpage = parseInt(totdata) / parseInt(pagesize4);
    //                        if (parseInt(totdata) % parseInt(pagesize4) != 0) {
    //                            totpage = parseInt(totpage) + 1;
    //                        }
    //                        $("#pagnumvalue4").attr("max", totpage);
    //                    }
    //                    var tfot = '';
    //                    tfot += '<ul>'
    //                    tfot += '<li>results <span>' + val.totRow + '</span>  <span id="sotopage4" style="display:none">' + totpage + '</span></li>'
    //                    tfot += '<li><span>|</span></li>'
    //                    tfot += '<li>pages ' + pageindex4 + '/ ' + parseInt(totpage) + '</li>'
    //                    tfot += '<li><span>|</span></li>'
    //                    tfot += '<li ><input type="number" id="pagnumvalue4" min="1"  class="footerInput"><a class="gobtn" type="button" id="getdatabypagenum4" style="margin-left:10px;cursor:pointer">Go</button> </li>'
    //                    if (val.totRow <= length) {
    //                    }
    //                    else if (pageno == 1) {
    //                    }
    //                    else if (pageno == totpage) {
    //                        tfot += '<li><span><a id="paginate4"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
    //                    }
    //                    else {
    //                        tfot += '<li><span><a id="paginate4"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
    //                    }
    //                    if (pageno < totpage) {
    //                        tfot += '<a  id="paginate4" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
    //                    }
    //                    $("#casetfooter4").append(tfot);
    //                }
    //                html3 += '<tr><td>' + Removenull(val.cfname) + ' </td><td>' + Removenull(val.ClientType) + ' </td><td>' + Removenull(val.CompanyName) + ' </td><td>' + Removenull(val.ClientName) + ' </td><td>' + Removenull(val.Contacttype) + ' </td><td>' + Removenull(val.Mobile) + ' </td><td>' + Removenull(val.Email) + ' </td><td>' + Removenull(val.Designation) + ' </td></tr>';
    //                $("#div5").show();
    //                $("#bindcasedatadivcount4").html(": (" + val.totRow + ") ");
    //            });
    //            $("#bindcasedata4").append(html3);
    //        },
    //        error: function (response) {
    //            alert(response.responseText);
    //        }
    //    });
    //    $.when(ld12).then(function (data, textStatus, jqXHR) {
    //        var rowCount = $('#example >tbody >tr').length;
    //        var rowCount1 = $('#example1 >tbody >tr').length;
    //        var rowCount2 = $('#example2 >tbody >tr').length;
    //        var rowCount3 = $('#example3 >tbody >tr').length;
    //        var rowCount4 = $('#example4 >tbody >tr').length;
    //        if (parseInt(rowCount) == 0 && parseInt(rowCount1) == 0 && parseInt(rowCount2) == 0 && parseInt(rowCount3) == 0 && parseInt(rowCount4) == 0) {
    //            if ($("#searchdata").val() != "") {
    //                $("#statusdiv").html("No results found for your query.").show();
    //            }
    //        }
    //        else {
    //            $("#statusdiv").html("").hide();
    //        }
    //        $("#btnsearch").removeAttr("disabled");
    //    });
    //}

    /*Get pegination*/
    //function getPagination(table) {
    //    $('#maxRows').on('change', function () {
    //        $('.pagination').html('');						// reset pagination
    //        var trnum = 0;									// reset tr counter
    //        var maxRows = parseInt($(this).val());
    //        var totalRows = $(table + ' tbody tr ').length;
    //        // alert(totalRows);// numbers of rows
    //        $('#example tbody tr').each(function () {			// each TR in  table and not the header
    //            trnum++;
    //            if (trnum > maxRows) {						// if tr number gt maxRows
    //                $(this).hide();							// fade it out
    //            } if (trnum <= maxRows) { $(this).show(); }// else fade in Important in case if it ..
    //        });											//  was fade out to fade it in
    //        if (totalRows > maxRows) {						// if tr total rows gt max rows option
    //            var pagenum = Math.ceil(totalRows / maxRows);
    //            //	numbers of pages
    //            for (var i = 1; i <= pagenum;) {			// for each page append pagination li
    //                $('.pagination').append('<li data-page="' + i + '">\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </li>').show();
    //            }											// end for i
    //        } 												// end if row count > max rows
    //        $('.pagination li:first-child').addClass('active'); // add active class to the first li
    //        $('.pagination li').on('click', function () {		// on click each page
    //            var pageNum = $(this).attr('data-page');
    //            // alert(pageNum);// get it's number
    //            var trIndex = 0;							// reset tr counter
    //            $('.pagination li').removeClass('active');	// remove active class from all li
    //            $(this).addClass('active');					// add active class to the clicked
    //            $('#example tbody tr').each(function () {		// each tr in table not the header
    //                trIndex++;
    //                // alert(trIndex);
    //                // tr index counter
    //                // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
    //                if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
    //                    $(this).hide();
    //                } else { $(this).show(); } 				//else fade in
    //            }); 										// end of for each tr in table
    //        });										// end of on click pagination list
    //    });
    //    // end of on select change
    //    // END OF PAGINATION
    //}
    //function getPagination1(table) {
    //    $('#maxRows').on('change', function () {
    //        $('.pagination').html('');						// reset pagination
    //        var trnum = 0;									// reset tr counter
    //        var maxRows = parseInt($(this).val());
    //        //alert(maxRows);
    //        //alert(maxRows);// get Max Rows from select option
    //        var totalRows = $(table + ' tbody tr ').length;
    //        // alert(totalRows);// numbers of rows
    //        $('#example1 tbody tr').each(function () {			// each TR in  table and not the header
    //            trnum++;
    //            //alert(trnum);// Start Counter
    //            if (trnum > maxRows) {						// if tr number gt maxRows
    //                $(this).hide();							// fade it out
    //            } if (trnum <= maxRows) { $(this).show(); }// else fade in Important in case if it ..
    //        });											//  was fade out to fade it in
    //        if (totalRows > maxRows) {						// if tr total rows gt max rows option
    //            var pagenum = Math.ceil(totalRows / maxRows);
    //            // alert(pagenum);// ceil total(rows/maxrows) to get ..
    //            //	numbers of pages
    //            for (var i = 1; i <= pagenum;) {			// for each page append pagination li
    //                $('.pagination').append('<li data-page="' + i + '">\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </li>').show();
    //            }											// end for i
    //        } 												// end if row count > max rows
    //        $('.pagination li:first-child').addClass('active'); // add active class to the first li
    //        $('.pagination li').on('click', function () {		// on click each page
    //            var pageNum = $(this).attr('data-page');
    //            // alert(pageNum);// get it's number
    //            var trIndex = 0;							// reset tr counter
    //            $('.pagination li').removeClass('active');	// remove active class from all li
    //            $(this).addClass('active');					// add active class to the clicked
    //            $('#example1 tbody tr').each(function () {		// each tr in table not the header
    //                trIndex++;
    //                // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
    //                if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
    //                    $(this).hide();
    //                } else { $(this).show(); } 				//else fade in
    //            }); 										// end of for each tr in table
    //        });										// end of on click pagination list
    //    });
    //    // end of on select change
    //    // END OF PAGINATION
    //}
    //function getPagination2(table) {
    //    $('#maxRows').on('change', function () {
    //        $('.pagination').html('');						// reset pagination
    //        var trnum = 0;									// reset tr counter
    //        var maxRows = parseInt($(this).val());
    //        //alert(maxRows);
    //        //alert(maxRows);// get Max Rows from select option
    //        var totalRows = $(table + ' tbody tr ').length;
    //        // alert(totalRows);// numbers of rows
    //        $('#example2 tbody tr').each(function () {			// each TR in  table and not the header
    //            trnum++;
    //            //alert(trnum);// Start Counter
    //            if (trnum > maxRows) {						// if tr number gt maxRows
    //                $(this).hide();							// fade it out
    //            } if (trnum <= maxRows) { $(this).show(); }// else fade in Important in case if it ..
    //        });											//  was fade out to fade it in
    //        if (totalRows > maxRows) {						// if tr total rows gt max rows option
    //            var pagenum = Math.ceil(totalRows / maxRows);
    //            // alert(pagenum);// ceil total(rows/maxrows) to get ..
    //            //	numbers of pages
    //            for (var i = 1; i <= pagenum;) {			// for each page append pagination li
    //                $('.pagination').append('<li data-page="' + i + '">\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </li>').show();
    //            }											// end for i
    //        } 												// end if row count > max rows
    //        $('.pagination li:first-child').addClass('active'); // add active class to the first li
    //        $('.pagination li').on('click', function () {		// on click each page
    //            var pageNum = $(this).attr('data-page');
    //            // alert(pageNum);// get it's number
    //            var trIndex = 0;							// reset tr counter
    //            $('.pagination li').removeClass('active');	// remove active class from all li
    //            $(this).addClass('active');					// add active class to the clicked
    //            $('#example2 tbody tr').each(function () {		// each tr in table not the header
    //                trIndex++;
    //                // alert(trIndex);
    //                // tr index counter
    //                // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
    //                if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
    //                    $(this).hide();
    //                } else { $(this).show(); } 				//else fade in
    //            }); 										// end of for each tr in table
    //        });										// end of on click pagination list
    //    });
    //    // end of on select change
    //    // END OF PAGINATION
    //}
    //function getPagination3(table) {
    //    $('#maxRows').on('change', function () {
    //        $('.pagination').html('');						// reset pagination
    //        var trnum = 0;									// reset tr counter
    //        var maxRows = parseInt($(this).val());
    //        //alert(maxRows);
    //        //alert(maxRows);// get Max Rows from select option
    //        var totalRows = $(table + ' tbody tr ').length;
    //        // alert(totalRows);// numbers of rows
    //        $('#example3 tbody tr').each(function () {			// each TR in  table and not the header
    //            trnum++;
    //            //alert(trnum);// Start Counter
    //            if (trnum > maxRows) {						// if tr number gt maxRows
    //                $(this).hide();							// fade it out
    //            } if (trnum <= maxRows) { $(this).show(); }// else fade in Important in case if it ..
    //        });											//  was fade out to fade it in
    //        if (totalRows > maxRows) {						// if tr total rows gt max rows option
    //            var pagenum = Math.ceil(totalRows / maxRows);
    //            // alert(pagenum);// ceil total(rows/maxrows) to get ..
    //            //	numbers of pages
    //            for (var i = 1; i <= pagenum;) {			// for each page append pagination li
    //                $('.pagination').append('<li data-page="' + i + '">\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </li>').show();
    //            }											// end for i
    //        } 												// end if row count > max rows
    //        $('.pagination li:first-child').addClass('active'); // add active class to the first li
    //        $('.pagination li').on('click', function () {		// on click each page
    //            var pageNum = $(this).attr('data-page');
    //            // alert(pageNum);// get it's number
    //            var trIndex = 0;							// reset tr counter
    //            $('.pagination li').removeClass('active');	// remove active class from all li
    //            $(this).addClass('active');					// add active class to the clicked
    //            $('#example3 tbody tr').each(function () {		// each tr in table not the header
    //                trIndex++;
    //                // alert(trIndex);
    //                // tr index counter
    //                // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
    //                if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
    //                    $(this).hide();
    //                } else { $(this).show(); } 				//else fade in
    //            }); 										// end of for each tr in table
    //        });										// end of on click pagination list
    //    });
    //    // end of on select change
    //    // END OF PAGINATION
    //}
    //function getPagination4(table) {
    //    $('#maxRows').on('change', function () {
    //        $('.pagination').html('');						// reset pagination
    //        var trnum = 0;									// reset tr counter
    //        var maxRows = parseInt($(this).val());
    //        //alert(maxRows);
    //        //alert(maxRows);// get Max Rows from select option
    //        var totalRows = $(table + ' tbody tr ').length;
    //        // alert(totalRows);// numbers of rows
    //        $('#example4 tbody tr').each(function () {			// each TR in  table and not the header
    //            trnum++;
    //            //alert(trnum);// Start Counter
    //            if (trnum > maxRows) {						// if tr number gt maxRows
    //                $(this).hide();							// fade it out
    //            } if (trnum <= maxRows) { $(this).show(); }// else fade in Important in case if it ..
    //        });											//  was fade out to fade it in
    //        if (totalRows > maxRows) {						// if tr total rows gt max rows option
    //            var pagenum = Math.ceil(totalRows / maxRows);
    //            // alert(pagenum);// ceil total(rows/maxrows) to get ..
    //            //	numbers of pages
    //            for (var i = 1; i <= pagenum;) {			// for each page append pagination li
    //                $('.pagination').append('<li data-page="' + i + '">\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
    //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </li>').show();
    //            }											// end for i
    //        } 												// end if row count > max rows
    //        $('.pagination li:first-child').addClass('active'); // add active class to the first li
    //        $('.pagination li').on('click', function () {		// on click each page
    //            var pageNum = $(this).attr('data-page');
    //            // alert(pageNum);// get it's number
    //            var trIndex = 0;							// reset tr counter
    //            $('.pagination li').removeClass('active');	// remove active class from all li
    //            $(this).addClass('active');					// add active class to the clicked
    //            $('#example4 tbody tr').each(function () {		// each tr in table not the header
    //                trIndex++;
    //                // alert(trIndex);
    //                // tr index counter
    //                // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
    //                if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
    //                    $(this).hide();
    //                } else { $(this).show(); } 				//else fade in
    //            }); 										// end of for each tr in table
    //        });										// end of on click pagination list
    //    });
    //    // end of on select change
    //    // END OF PAGINATION
    //}
    function Removenull(strtext) {
        if (strtext == "" || strtext == "null" || strtext == null || strtext == "undefined") {
            strtext = "";
        }
        return strtext;
    }
});