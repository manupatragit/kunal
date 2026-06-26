var ecpageindex = 1, ecpagesize = 10, ecrecordcount = 0, ectotrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    /*Export expense report in excel*/
    $('#oexcel').click(function () {
        var ddlExpenceClient = $('#ddlExpenceClient').val();
        var ddlExpenceCase = $('#ddlExpenceCase').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        var loginid = $("#ddlExpUser").val();
        var expensetype = $("#ddlExpenseType").val();
        var category = $("#ddlCategory").val();
        var createdfor = $("#ddlExpenceTeamMemberCr").val();
        var txtRetainername = $("#filterretainerName").val();
        window.location = encodeURI("/Firm/ExportoExcelExpenseReport?pagenum=1&pagesize=5000&datefrom=" + datefrom + "&dateto=" + dateto + "&loginid=" + loginid + "&ddlExpenceClient=" + ddlExpenceClient + "&ddlExpenceCase=" + ddlExpenceCase + "&expensetype=" + expensetype + "&category=" + category + "&createdfor=" + createdfor + "&Retainername=" + txtRetainername);
    });
    /*Export expense report in pdf*/
    $('#opdf').click(function () {
        var ddlExpenceClient = $('#ddlExpenceClient').val();
        var ddlExpenceCase = $('#ddlExpenceCase').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        var loginid = $("#ddlExpUser").val();
        var expensetype = $("#ddlExpenseType").val();
        var category = $("#ddlCategory").val();
        var createdfor = $("#ddlExpenceTeamMemberCr").val();
        window.location = encodeURI("/Firm/ExportoPdfExpenseReport?pagenum=1&pagesize=5000&datefrom=" + datefrom + "&dateto=" + dateto + "&loginid=" + loginid + "&ddlExpenceClient=" + ddlExpenceClient + "&ddlExpenceCase=" + ddlExpenceCase + "&expensetype=" + expensetype + "&category=" + category + "&createdfor=" + createdfor);
    });
    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        $('input[type = "date"]').attr("onkeydown", "");
        $('input[type = "date"]').attr("onkeypress", "");
    }
    $('input[type = "date"]').attr("placeholder", "yyyy-mm-dd");
    $('input[type = "date"]').blur(function () {
        var dateString = $(this).val();
        if (dateString != "") {
            var regex1 = /(((0|1)[0-9]|2[0-9]|3[0-1])-(0[1-9]|1[0-2])-((19|20)\d\d))$/;
            var regexw = /(((((19|20)\d\d)-(0[1-9]|1[0-2])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
            var regex = /(((((19|20|21|22|23|24|25)\d\d)-(0[1-9]|1[012])-0|1)[0-9]|2[0-9]|3[0-1]))$/;
            //Check whether valid dd/MM/yyyy Date Format.
            if (regex.test(dateString)) {
                var parts = dateString.split("-");
                var dtDOB = new Date(parts[1] + "-" + parts[0] + "-" + parts[2]);
                if (parseInt(parts[0]) < 1900) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[0]) > 3000) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[1]) == 00 || parseInt(parts[1]) > 12) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                if (parseInt(parts[2]) == 00) {
                    $(this).focus();
                    $(this).val("");
                    alert("Invalid Date");
                    return false;
                }
                var dtCurrent = new Date();
                return true;
            } else {
                $(this).focus();
                $(this).val("");
                alert("Invalid Date");
                return false;
            }
        }
    });
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        event.stopPropagation();
    });
    loadteamleader();
    GetExpenseType();
    GetExpenseCategory();
    $("#ddlCurrencyFilter").change(function () {
        loadflag = true;
        LoadExpenseData(1);
    });

    /*Load expense data*/
    function LoadExpenseData(ecpageindex) {
        var html3 = ''; var tfot = ''; var tfot1 = '';
        var formdata = new FormData();
        var ddlExpenceClient = $("#ectimecontact").val().toString() == "" ? "" : $("#ectimecontactvalue").val();
        var ddlExpenceCase = $('#ecmatter').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        var loginid = $("#ddlExpUser").val();
        var expensetype = $("#ddlExpenseType").val();
        var category = $("#ddlCategory").val();
        var createdfor = $("#ddlExpenceTeamMemberCr").val();
        var txtRetainername = $("#filterretainerName").val();
        var txtdescriptionfilter = $("#expensefilterdescription").val();
        var currencyfilter = $("#ddlCurrencyFilter").val();
        if (datefrom != "") {
            if (dateto == "") {
                alert("Please select END date");
                return false;
            }
        }
        if (dateto != "") {
            if (datefrom == "") {
                alert("Please select START date");
                return false;
            }
        }
        $("#ecfooterexp").empty();
        formdata.append("pagenum", EncodeText(ecpageindex));
        formdata.append("pagesize", EncodeText(ecpagesize));
        formdata.append("ddlExpenceClient", EncodeText(ddlExpenceClient));
        formdata.append("ddlExpenceCase", EncodeText(ddlExpenceCase));
        formdata.append("datefrom", EncodeText(datefrom));
        formdata.append("dateto", EncodeText(dateto));
        formdata.append("loginid", EncodeText(loginid));
        formdata.append("expensetype", EncodeText(expensetype));
        formdata.append("category", EncodeText(category));
        formdata.append("createdfor", EncodeText(createdfor));
        formdata.append("txtRetainername", EncodeText(txtRetainername));
        formdata.append("txtdescriptionfilter", EncodeText(txtdescriptionfilter));
        formdata.append("currencyfilter", EncodeText(currencyfilter));
        openload();
        var sct1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/ReportApi/ExpenseCreatedReport",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#bindexpense").html("");
                    var length = response1.Data.length;
                    tfot = "";
                    $("#ecfooterexp").empty();
                    $.each(response1.Data, function (i, a) {
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
                        var totdata = a.totRow;
                        var totpage = 0;
                        if (i === (length - 1)) {
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            if (pageindex == totpage) {
                                $('#next').hide();
                                //$('#next').css("display", "none");
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

                            if (isRenderPage == false) {
                                renderPagination(pageindex, totpage);
                            }
                        //if (i === 0) {
                        //    firstvalue = a.rownum;
                        //}
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
                        //        $("#ecpagnumvalue").attr("max", totpage);
                        //    }
                        //    tfot += '<li>results <span>' + totdata + '</span>  <span id="ecsotopage" style="display:none">' + totpage + '</span></li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li>pages ' + ecpageindex + '/ ' + parseInt(totpage) + '</li>'
                        //    tfot += '<li><span>|</span></li>'
                        //    tfot += '<li ><input type="number" id="ecpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="ecgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                        //    tfot += '<li>'
                        //    if (a.totRow <= length) { }
                        //    else if (pageno == 1) { }
                        //    else if (pageno == totpage) {
                        //        tfot += '<li><span><a id="ecpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    else {
                        //        tfot += '<li><span><a id="ecpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                        //    }
                        //    if (pageno < totpage) {
                        //        tfot += '<a id="ecpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a></span>'
                        //    }
                        //    $("#ecfooterexp").append(tfot);
                        }
                        var Date = a.dExpensedate;
                        var CASEName = a.Casename;
                        var CLIENTName = a.cfname;
                        var Expensetype = a.ExpenseType;
                        var Category = a.ExpenseCategory;
                        if (Category == "null" || Category == null || Category == "") {
                            Category = "";
                        }
                        var Description = a.Descriptions;
                        var Price = a.Price_Rate;
                        var Unit = a.Units;
                        var Total = a.Total;
                        var Receipt = a.UploadReceipt;
                        var expenseid = a.ExpenseId;
                        var CurrencyName = a.CurrencyName;
                        var FinalTotal = parseFloat(a.Total) - parseFloat(a.PaidAmt);
                        if (CurrencyName == "null" || CurrencyName == null || CurrencyName == "") {
                            CurrencyName = "";
                        }
                        var duedate = a.duedate;
                        if (String(duedate) == "null" || String(duedate) == null || duedate == "") {
                            duedate = "";
                        }
                        else {
                            duedate = formatDatetoIST(a.duedate);
                        }
                        if (String(a.isSync) == "1") {
                            dsyncicon = "glyphicon glyphicon-retweet";
                            dsynctitle = "Marked for data synchronization";
                        }
                        else {
                            dsyncicon = "";
                            dsynctitle = "";
                        }
                        html3 += '<tr>'
                        html3 += '<td class="eDate">'
                        html3 += '<span name="Date" id="clname" >' + formatDatetoIST(Date) + '</span><i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'
                        html3 += '</td>'
                        html3 += '<td class="eCaseName">'
                        html3 += '<span id="clname" >' + CASEName + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="Retainername">'
                        html3 += '<span id="Retainername" >' + a.Retainername + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="eClientName">'
                        html3 += '<span id="clname" >' + CLIENTName + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="eExpenseType">'
                        html3 += '<span id="clname" >' + Expensetype + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="eCategory">'
                        html3 += '<span id="clname" >' + Category + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="eCurrency">'
                        html3 += '<span id="clname" >' + CurrencyName + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="eDescription">'
                        html3 += '<span id="clname" >' + Description + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="eDueDate">'
                        html3 += '<span>' + duedate + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="ePriceRate" >'
                        html3 += '<span id="clname" >' + Price + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="eUnit">'
                        html3 += '<span id="clname" >' + Unit + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="eTotalPayment">'
                        html3 += '' + a.Total + ''
                        html3 += '</td>'
                        html3 += '<td class="ePayReceived">'
                        html3 += '<span>' + a.PaidAmt + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="eTotal">'
                        html3 += '' + FinalTotal + ''
                        html3 += '</td>'
                        html3 += '</td>'
                        html3 += '<td class="createdby">'
                        html3 += '<span id="createdby" >' + a.CreatedBy + '</span>'
                        html3 += '</td>'
                        if (a.DocsCount > 0) {
                            html3 += '<td class="eReceipt">'
                            html3 += '<button type="button" class="btn  btn-sm" id-val="' + expenseid + '" id="filelink"><i class="glyphicon glyphicon-folder-open"></i></button>'
                            html3 += '</td>'
                        }
                        else {
                            html3 += '<td class="eReceipt">'
                            html3 += '</td>'
                        }
                        html3 += '<td class="createdfor">'
                        html3 += '<span id="createdfor" >' + a.MemberName + '</span>'
                        html3 += '</td>'
                        html3 += '</tr>'
                    });
                    $("#bindexpense").html("");
                    $("#bindexpense").append(html3);
                    $("input:checkbox:not(:checked)").each(function () {
                        var column = "table ." + $(this).attr("name");
                        $(column).hide();
                    });
                    if ($("#ectimecontact").val() != "" || $("#ddlExpUser").val() != "" || $("#ecmatter").val() != "" || $("#ddlCategory").val() != "" || $("#ddlExpenceTeamMemberCr").val() != "" || $("#datefrom").val() != "" || $("#dateto").val() != "" || $("#ddlExpenseType").val() != "") {
                        calculateColumn(9);
                        $("#sumdiv").css("display", "unset");
                    }
                    else {
                        $("#sumdiv").css("display", "none");
                    }
                    closeload();
                }
                else {
                    html3 = '<tr><td colspan=11>No result found !</td></tr>'
                    $("#sumdiv").css("display", "none");
                    $('#totalamount').text("0");
                    $("#bindexpense").html(html3);
                    closeload();
                }
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
        $.when(sct1).then(function (data, textStatus, jqXHR) {
            $("#EColli li input:checkbox:not(:checked)").each(function () {
                var column = "#cexample1 ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
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
        $("#prev").toggleClass("disabled", pageindex === 1);
        $("#next").toggleClass("disabled", pageindex === totdata);
        isRenderPage = true;
    }


    var setPageNo = 1;
    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        LoadExpenseData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        LoadExpenseData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = true;
        $("#txtgopage").val("");
        LoadExpenseData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    $("#divGo").click(function () {
        let goToPage = parseInt($("#txtgopage").val());
        if (!isNaN(goToPage)) {
            setPageNo = goToPage;
        }
        loadflag = true;
        isRenderPage = true;
        LoadExpenseData(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    /*Pagination End*/

    function calculateColumn(index) {
        var total = 0;
        $('#cexample1 tr').each(function () {
            var value = parseInt($('td', this).eq(index).text());
            if (!isNaN(value)) {
                total += value;
            }
        });
        $('#totalamount').text(total);
    }
    $(document).on('click', '#ecpaginate', function () {
        ecpageindex = $(this).attr("index");
        LoadExpenseData(ecpageindex);
    });
    $(document).on("click", "#searretainerName", function () {
        $("#clearretainerName").css("display", "unset");
        LoadExpenseData(1);
    });
    $(document).on("click", "#clearretainerName", function () {
        $("#filterretainerName").val("");
        $("#clearretainerName").css("display", "none");
        LoadExpenseData(1);
    });
    $(document).on("click", "#searchdescription", function () {
        var casefiltercasename = $("#expensefilterdescription").val();
        if (casefiltercasename == "") {
            alert("Please enter the description.");
            $("#expensefilterdescription").focus();
            return false;
        }
        $("#clearnewsearchdescription").css("display", "unset");
        LoadExpenseData(1);
    });
    $(document).on("click", "#clearnewsearchdescription", function () {
        $("#expensefilterdescription").val("");
        $("#clearnewsearchdescription").css("display", "none");
        LoadExpenseData(1);
    });
    $('#divcontent').off("click").on('click', '#ecgetpagnumvalue', function () {
        ecpageindex = $("#ecpagnumvalue").val();
        if (ecpageindex != "undefined") {
            if (Math.sign(ecpageindex) == 1) {
                var pageindesx = $("#ecsotopage").text();
                if (ecpageindex <= parseInt(pageindesx)) {
                    openload();
                    LoadExpenseData(ecpageindex);
                    closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });

/*Load firm user by firm id*/
    function LoadUsersbyFirmid_Roleid() {
        var html3 = '';
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/UsersbyFirmid_Userid_Roleid",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1.Data != "") {
                    $("#ddlExpUser").html("");
                }
                html3 += '<option value="">Select User</option>';
                $.each(response1.Data, function (k, a) {
                    var LoginId = a.LoginId;
                    var cfname = a.cfname + " [" + a.EmailId + "]";
                    var EmailId = a.EmailId;
                    html3 += '<option value=' + LoginId + '>' + cfname + '</option>'
                });
                $("#ddlExpUser").html("");
                $("#ddlExpUser").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }

/*Load matter for clint by case id*/
    function Casebyajax(caseid) {
        var clientid = $("#ddlExpenceClient").val();
        $('#ddlExpenceCase').empty().append('<option value="">Select</option>').find('option:first').attr("selected", "selected");
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
                        var option = "";
                        if (mid == caseid) {
                            option = '<option selected value="' + mid + '" > ' + mattername + '</option>';
                        }
                        else {
                            option = '<option value="' + mid + '" > ' + mattername + '</option>';
                        }
                        $("#ddlExpenceCase").append(option);
                    }
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

/*Get expense type*/
    function GetExpenseType() {
        var groupval = "";
        var html3 = '';
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/BindExpenseType",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                html3 += '<option value="">Select</option>';
                if (response1.Data != "") {
                    $("#ddlExpenseType").html("");
                }
                else {
                    $("#ddlExpenseType").html("No Expense Type !");
                }
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    var IId = a.IId;
                    var ExpenseType = a.ExpenseType;
                    html3 += '<option value="' + IId + '">' + ExpenseType + '</option>';
                });
                $("#ddlExpenseType").html("");
                $("#ddlExpenseType").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }

/*Get expense category*/
    function GetExpenseCategory() {
        var groupval = "";
        var html3 = '';
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ExpenseApi/BindExpenseCategory",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                html3 += '<option value="">Select</option>';
                if (response1.Data != "") {
                    $("#ddlCategory").html("");
                }
                else {
                    $("#ddlCategory").html("No Category !");
                }
                var length = response1.Data.length;
                $.each(response1.Data, function (i, a) {
                    var IId = a.iid;
                    var ExpenseCategory = a.ExpenseCategory;
                    html3 += '<option value="' + IId + '">' + ExpenseCategory + '</option>';
                });
                $("#ddlCategory").html("");
                $("#ddlCategory").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    $("#searchdatas").click(function () {
        LoadExpenseData(1);
    })
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
    $(document).on("click", "#filelink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=Expense&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });
});
function openload() {
    $("#myOverlay").css("display", "block");
}
function closeload() {
    $("#myOverlay").css("display", "none");
}

/*Load team leader*/
function loadteamleader() {
    $("#member").html("");
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
            $("#ddlExpUser").append("<option value=''>Select</option>");
            $.each(obj, function (i, a) {
                if (a.roleid == 1) {
                    var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (Admin)</option>';
                    $("#ddlExpUser,#ddlExpenceTeamMemberCr").append(option);
                    html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="#" class="dropdown-item">' + a["UserName"] + '(Admin)</a></li>'
                }
                else {
                    if (a.IsPartner == 1) {
                        if (a.roleid != 3) {
                            var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (' + a.RoleName + ')</option>';
                            $("#ddlExpUser,#ddlExpenceTeamMemberCr").append(option);
                            html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(' + a.RoleName + ')</a></li>'
                        }
                    }
                    else {
                        if (a.PartnerId == "" || a.PartnerId == null || a.PartnerId == "null") {
                            if (a.roleid != 3) {
                                var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + ' (User)</option>';
                                $("#ddlExpUser,#ddlExpenceTeamMemberCr").append(option);
                                html3 += '<li><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls"  value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + '(User)</a></li>'
                            }
                        }
                        else {
                            if (a.roleid != 3) {
                                var option = '<option value="' + a["id"] + '"  tempUserName="' + a["UserName"] + '"> ' + a["UserName"] + '-(User-' + a.PartnerName + ')</option>';
                                $("#ddlExpUser,#ddlExpenceTeamMemberCr").append(option);
                                html3 += '<li ddd><input id="chkTaskgroup" type="checkbox" class="shcheckbox1 taskmembercls" value="' + a["id"] + '" tempUserName="' + a["UserName"] + '"><a href="javascript:void" class="dropdown-item">' + a["UserName"] + ' - (User ' + a.PartnerName + ')</a></li>'
                            }
                        }
                    }
                }
            });
            $("#member").html("");
            $("#member").append(html3);
            $("#member").css("height", "100px !Important");
            return false;
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}

$(document).on('change', '.chkdhide', function () {
    // your code
    var column = "." + $(this).attr("name");
    $(column).toggle();
});