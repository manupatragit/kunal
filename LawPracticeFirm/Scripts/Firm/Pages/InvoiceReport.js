var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
var searchflag = 0;
$(document).ready(function () {
    //Reset Form 
    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });

    $("#expClearReport").click(function () {
        $('#idinvreportformat')[0].reset();
    });

    /*Payment status*/
    $("#PaymentStatus").change(function () {
        $('#chqstatusdiv option[value=""]').prop("selected", true);
        if ($(this).val() == "ChequeStatus") {
            $("#chqstatusdiv").show();
        }
        else {
            $("#chqstatusdiv").hide();
        }
    });
    /*Export issue report in excel*/
    $("#oexcel").click(function () {
        var pagenum = pageindex;
        var pagesize = pagesize;
        var cnamefilter = $("#searchname").val();
        var fromfilter = $("#searchfrom").val();
        var tofilter = $("#searchto").val();
        var amountfilter = "";
        var searchflag = searchflag;
        var matterid = $("#mattername").val();
        var filterinvoietype = $("#InvoiceType").val();
        var FilterInvoiceStatus = $("#InvoiceStatus").val();
        window.location = encodeURI("/Firm/ExportoExcelIssueReport?pagenum=1&pagesize=5000&cnamefilter=" + cnamefilter + "&fromfilter=" + fromfilter +
            "&tofilter=" + tofilter + "&searchflag=" + searchflag + "&matterid=" + matterid + "&filterinvoietype=" + filterinvoietype +
            "&amountfilter=" + amountfilter + "&FilterInvoiceStatus=" + FilterInvoiceStatus);
    });
    $("#opdf").click(function () {
        var pagenum = pageindex;
        var pagesize = pagesize;
        var cnamefilter = $("#searchname").val();
        var fromfilter = $("#searchfrom").val();
        var tofilter = $("#searchto").val();
        var amountfilter = "";
        var searchflag = searchflag;
        var matterid = $("#mattername").val();
        var filterinvoietype = $("#InvoiceType").val();
        var FilterInvoiceStatus = $("#InvoiceStatus").val();
        window.location = encodeURI("/Firm/ExportoPDFIssueReport?pagenum=1&pagesize=5000&cnamefilter=" + cnamefilter + "&fromfilter=" + fromfilter +
            "&tofilter=" + tofilter + "&searchflag=" + searchflag + "&matterid=" + matterid + "&filterinvoietype=" + filterinvoietype +
            "&amountfilter=" + amountfilter + "&FilterInvoiceStatus=" + FilterInvoiceStatus);
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

    /*Open loader*/
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
    /*Open payment*/
    $(document).on("click", "#OpenPayment", function () {
        $('#myModalpayment').modal({ show: true });
        tokeninvoice = $(this).attr("data-id");
        paymentype = $(this).attr("data-paymentype");
        var formdata = new FormData();
        formdata.append("Invoiceid", tokeninvoice);
        formdata.append("PaymentTypeFilter", EncodeText(""));
        var htmlpay = '';
        openload();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/InvoicePaymentbyInvoiceID",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#PaymentDetailsdiv").empty();
                var obj = JSON.parse(response.Data);
                try {
                    if (parseInt(obj.length) == 0) {
                        $("#paymentdetaisnoresultdiv").css("display", "block");
                    }
                    else {
                        $("#paymentdetaisnoresultdiv").css("display", "none");
                    }
                }
                catch
                {
                    $("#paymentdetaisnoresultdiv").css("display", "block");
                    closeload();
                    return false;
                }
                $.each(obj, function (i, a) {
                    htmlpay += '<tr>'
                    htmlpay += '<td>' + formatDatetoIST(a.PDate) + '</td>'
                    htmlpay += '<td>' + a.PaymentType + '</td>'
                    htmlpay += '<td>' + a.Amount + '</td>'
                    htmlpay += '<td>' + a.BankName + '</td>'
                    htmlpay += '<td>' + a.DdNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Ddidate) + '</td>'
                    htmlpay += '<td>' + a.ChequeNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Chqidate) + '</td>'
                    htmlpay += '<td>' + a.RefNo + '</td>'
                    htmlpay += '<td>' + a.OtherDetails + '</td>'
                    htmlpay += '<td>' + a.CheckStatus + '</td>'
                    htmlpay += '</tr>'
                }); //End of foreach Loop
                $("#PaymentDetailsdiv").empty().html(htmlpay);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });

    /*Open payment status*/
    $(document).on("click", "#OpenPaymentStatus", function () {
        $('#myModalpayment').modal({ show: true });
        tokeninvoice = $(this).attr("data-id");
        paymentype = $(this).attr("data-paymentype");
        var formdata = new FormData();
        formdata.append("Invoiceid", tokeninvoice);
        formdata.append("PaymentTypeFilter", EncodeText("Cheque"));
        var htmlpay = '';
        openload();
        $.ajax({
            async: true,
            url: "/api/OcrInvoiceApi/InvoicePaymentbyInvoiceID",
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                $("#PaymentDetailsdiv").empty();
                var obj = JSON.parse(response.Data);
                try {
                    if (parseInt(obj.length) == 0) {
                        $("#paymentdetaisnoresultdiv").css("display", "block");
                    }
                    else {
                        $("#paymentdetaisnoresultdiv").css("display", "none");
                    }
                }
                catch
                {
                    $("#paymentdetaisnoresultdiv").css("display", "block");
                    closeload();
                    return false;
                }
                $.each(obj, function (i, a) {
                    htmlpay += '<tr>'
                    htmlpay += '<td>' + formatDatetoIST(a.PDate) + '</td>'
                    htmlpay += '<td>' + a.PaymentType + '</td>'
                    htmlpay += '<td>' + a.Amount + '</td>'
                    htmlpay += '<td>' + a.BankName + '</td>'
                    htmlpay += '<td>' + a.DdNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Ddidate) + '</td>'
                    htmlpay += '<td>' + a.ChequeNo + '</td>'
                    htmlpay += '<td>' + formatDatetoIST(a.Chqidate) + '</td>'
                    htmlpay += '<td>' + a.RefNo + '</td>'
                    htmlpay += '<td>' + a.OtherDetails + '</td>'
                    htmlpay += '<td>' + a.CheckStatus + '</td>'
                    htmlpay += '</tr>'
                }); //End of foreach Loop
                $("#PaymentDetailsdiv").empty().html(htmlpay);
                closeload();
            },
            error: function (response) {
                alert(response.responseText);
                closeload();
            }
        });
    });

    /*View invoice version*/
    $(document).on("click", "#viewinvoiceversion", function () {
        var valuetoken = $(this).attr("token");
        var invno = $(this).attr("filename");
        var ct = 5;
        var formData = new FormData();
        formData.append("Invoiceid", valuetoken);
        var html6 = '';
        $.ajax({
            async: true,
            url: '/api/OcrInvoiceApi/InvoiceVersionList',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                $("#invoicelist").animate({ scrollTop: $("#invoicelist").height() }, 1000);
                invno = String(invno).replaceAll('/', '_');
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                        $("#bindinvoiceversion" + invno).empty().html("<tr><td colspan='6' align='center'>No invoice found</td</tr>");
                        return false;
                    }
                    var obj = JSON.parse(response.Data);
                }
                else {
                    //alert("not found");
                }
                var cheintb = false;
                ct = 1;
                $.each(obj, function (i, a) {
                    var downloadpath = "";
                    html6 += '<tr>';
                    html6 += '<td>' + a.RowNum + '</td>';
                    html6 += '<td>' + formatDatetoIST(a.Inovicedate) + '</td>';
                    html6 += '<td>' + a.InvoiceNo + '</td>';
                    html6 += '<td>' + a.CreatedBy + '</td>';
                    html6 += '<td>' + a.TotAmt + '</td>';
                    if (a.IsAmend == "1") {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download Invoice" data-val="' + a.id + '" id="viewinvoicedata" data-type="' + ct + '" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">' + invno + ' (Version - ' + ct + ')</span></td>';
                        ct = ct + 1;
                    }
                    else {
                        html6 += '<td><span style="color:#069; cursor:pointer" title="Download Invoice" data-val="' + a.id + '" id="viewinvoicedata" data-type="o" href-val="' + downloadpath + '" href="javascript:void();" values="' + a.Id + '">Original Invoice</span></td>';
                    }
                    html6 += '</tr>';
                });
                $("#bindinvoiceversion" + invno).empty().html(html6);
            },
            failure: function (response) {
                alert(data.responseText);
            },
            error: function (response) {
                alert(data.responseText);
            }
        });
    });
    loadcontact1();

    /*Load invoice data*/
    function loadInvoicedata(pageindex) {
        var html = '';
        var formData = new FormData();
        formData.append("pagenum", EncodeText(pageindex));
        formData.append("pagesize", EncodeText(pagesize));
        formData.append("cnamefilter", EncodeText($("#searchname").val()));
        formData.append("fromfilter", EncodeText($("#searchfrom").val()));
        formData.append("tofilter", EncodeText($("#searchto").val()));
        formData.append("amountfilter", EncodeText(""));
        formData.append("searchflag", EncodeText(searchflag));
        formData.append('matterid', EncodeText($("#mattername").val()));
        formData.append("filterinvoietype", EncodeText($("#InvoiceType").val()));
        formData.append("FilterInvoiceStatus", EncodeText($("#InvoiceStatus").val()));
        $("#assignuserdata").html("");
        $("#invfooter").html("");
        //read assign using list
        openload();
        qty1 = 0;
        var ld12 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/ReportApi/LoadInvoiceReport",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var datas1 = JSON.stringify(response1);
                var obj = JSON.parse(response1.Data);
                var length = obj.length;
                if (response1.Data.length > 2) {
                    $("#datastatus").hide();
                    //$("#datastatus").html("");
                    closeload();
                }
                
                else {
                    $("#datastatus").show();
                    // $("#datastatus").html("No result found !");
                    closeload();
                }
                if (obj.length == 0) {
                    document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "none", "important"); });
                }
                $.each(obj, function (i, a) {
                    if (i === 0) {
                        firstvalue = a.rownum;
                    }
                    var totdata = a.totRow;
                    var totpage = 0;
                    if (i === (length - 1)) {
                        document.querySelectorAll(".pagination").forEach(function (e) { e.style.setProperty("display", "flex", "important"); });
                        totpage = parseInt(totdata) / parseInt(pagesize);
                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                            totpage = parseInt(totpage) + 1;
                        }
                        if (pageindex == totpage) {
                            $('#next').hide();
                            //$('#next').css("display", "none");
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
                            renderPagination(pageindex, totpage);
                        }
                    //if (i === (length - 1)) {
                    //    var pnext = pageindex;
                    //    var pprev = pageindex;
                    //    var pageno = pageindex;
                    //    var totdata = a.totRow;
                    //    var totpage = 0;
                    //    if (a.totRow > 0) {
                    //        pnext = parseInt(pnext) + 1;
                    //        if (pnext == 0) pnext = 1;
                    //        pprev = parseInt(pageno) - 1;
                    //        if (pprev == 0) pprev = 1;
                    //        totpage = parseInt(totdata) / parseInt(pagesize);
                    //        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                    //            totpage = parseInt(totpage) + 1;
                    //        }
                    //        $("#invpagnumvalue").attr("max", totpage);
                    //    }
                    //    var tfot = '';
                    //    tfot += '<ul>'
                    //    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="invsotopage" style="display:none">' + totpage + '</span></li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    //    tfot += '<li><span>|</span></li>'
                    //    tfot += '<li ><input type="number" id="invpagnumvalue" min="1"  class="footerInput"><a class="gobtn" type="button" id="invgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</a></button> </li>'
                    //    if (a.totRow <= length) {
                    //    }
                    //    else if (pageno == 1) {
                    //    }
                    //    else if (pageno == totpage) {
                    //        tfot += '<li><span><a id="invpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    //    }
                    //    else {
                    //        tfot += '<li><span><a id="invpaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png"> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    //    }
                    //    if (pageno < totpage) {
                    //        tfot += '<a  id="invpaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                    //    }
                    //    tfot += '</ul>'
                    //    $("#invfooter").html(tfot);
                    }
                    qty1 = qty1 + 1;
                    var famt = parseFloat(a.TotAmt) - parseFloat(a.PaidAmt);
                    var trcolordata = "";
                    var d1 = new Date();
                    var d2 = new Date(a.duedate);
                    if (d1 >= d2 && famt != "0") {
                        trcolordata = "trcolor";
                    }
                    else {
                        trcolordata = "";
                    }
                    if (a.IsCanceled == 1) {
                        trcolordata = "";
                    }
                    else {
                    }
                    var paymentcursor = "";
                    if (a.PaymentType != "") {
                        paymentcursor = "cursor:pointer;color:#069;"
                    }
                    var statuscursor = "";
                    if (a.ChequeStatus != "") {
                        statuscursor = "cursor:pointer;color:#069;"
                    }
                    var shareinvoiceclientcss = "";
                    if (a.IsInvoiceClientShared == "1") {
                        shareinvoiceclientcss = "color:#37c137 !important";
                    }
                    if (roleids == "3") {
                        if (famt == "0") {
                            html += '<tr class="' + trcolordata + '"><td >' + a.rownum + '</td><td class="invoicenubmer">' + a.InvoiceNo + '</td><td class="clientname">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="invamount">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="icreatedby">' + a.CreatedBy + '</td><td class="cdate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="invdownload"><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata"  href="javascript:void()">Original</a>&nbsp;|&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a></td></tr>';
                        }
                        else {
                            html += '<tr class="' + trcolordata + '"><td>' + a.rownum + '</td><td class="invoicenubmer">' + a.InvoiceNo + '</td><td class="clientname">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="invamount">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="icreatedby">' + a.CreatedBy + '</td><td class="cdate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="invdownload"><a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()">Original</a>&nbsp;|&nbsp;<a name="' + a.InvoiceNo + '"  data-val="' + a.id + '" data-type="d" id="viewinvoicedata" href="javascript:void()">Duplicate</a></td></tr>';
                        }
                    }
                    else {
                        if (famt == "0") {
                            if (roleids == 1) {
                                html += '<tr class="' + trcolordata + '"><td>' + a.rownum + '</td>';
                                html += '<td class="invoicenubmer">' + a.InvoiceNo + ''
                                html += '<div class="pull-right">'
                                html += '<div class="btn-group" >'
                                html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                html += '<span class="caret"></span>'
                                html += '<span class="sr-only">Toggle Dropdown</span>'
                                html += '</button>'
                                html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                html += '</tbody>'
                                html += '</table>'
                                html += '</div>'
                                html += '</div>'
                                html += '</td>'
                                html += '<td class="clientname">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="invamount">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="icreatedby">' + a.CreatedBy + '</td><td class="cdate">' + formatDatetoIST(a.duedate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td>';
                                html += '<td class="invdownload"> <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>';
                                for (var i = 1; i <= a.AmendCount; i++) {
                                    html += '| <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>';
                                }
                                html += '</td>';
                                html += '</tr>';
                            }
                            else {
                                html += '<tr class="' + trcolordata + '"><td>' + a.rownum + '</td>';
                                html += '<td class="invoicenubmer">' + a.InvoiceNo + '';
                                html += '<div class="pull-right">'
                                html += '<div class="btn-group" >'
                                html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                html += '<span class="caret"></span>'
                                html += '<span class="sr-only">Toggle Dropdown</span>'
                                html += '</button>'
                                html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                html += '</tbody>'
                                html += '</table>'
                                html += '</div>'
                                html += '</div>'
                                html += '</td>';
                                html += '<td class="clientname">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="invamount">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="icreatedby">' + a.CreatedBy + '</td><td class="cdate">' + formatDatetoIST(a.duedate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td><td class="invdownload"></td>';
                                html += '<td class="invdownload"> <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>';
                                for (var i = 1; i <= a.AmendCount; i++) {
                                    html += '| <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>';
                                }
                                html += '</td>';
                                html += '</tr>';
                            }
                        }
                        else {
                            if (roleids == 1) {
                                html += '<tr class="' + trcolordata + '"><td>' + a.rownum + '</td>';
                                html += '<td class="invoicenubmer">' + a.InvoiceNo + '';
                                html += '<div class="pull-right">'
                                html += '<div class="btn-group" >'
                                html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                html += '<span class="caret"></span>'
                                html += '<span class="sr-only">Toggle Dropdown</span>'
                                html += '</button>'
                                html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                html += '</tbody>'
                                html += '</table>'
                                html += '</div>'
                                html += '</div>'
                                html += '</td>';
                                html += '<td class="clientname">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="invamount">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="icreatedby">' + a.CreatedBy + '</td><td class="cdate">' + formatDatetoIST(a.duedate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td>';
                                html += '<td class="invdownload"> <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>';
                                for (var i = 1; i <= a.AmendCount; i++) {
                                    html += '| <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>';
                                }
                                html += '</td>';
                                html += '</tr>';
                            }
                            else {
                                html += '<tr class="' + trcolordata + '"><td>' + a.rownum + '</td>';
                                html += '<td class="invoicenubmer">' + a.InvoiceNo + '';
                                html += '<div class="pull-right">'
                                html += '<div class="btn-group" >'
                                html += '<button type="button"  title="Click here to view invoice version"  id="viewinvoiceversion" token="' + a.id + '" filename="' + a.InvoiceNo + '" class="btn btn-sm  dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="height: 26px;">'
                                html += '<span class="caret"></span>'
                                html += '<span class="sr-only">Toggle Dropdown</span>'
                                html += '</button>'
                                html += '<div class="dropdown-menu"  style="width:554px;overflow-x:auto;background: #eaeaea;-webkit-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);-moz-box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);box-shadow: 0px 0px 6px 3px rgba(61,61,61,0.27);">'
                                html += '<table width="100%"><thead><tr><th>#</th><th>Date</th><th>Invoice No</th><th>Created By</th><th>Amount</th><th>Invoice Version</th></tr></thead>'
                                var tempinvno = String(a.InvoiceNo).replaceAll('/', '_');
                                html += '<tbody id="bindinvoiceversion' + tempinvno + '" >'
                                html += '</tbody>'
                                html += '</table>'
                                html += '</div>'
                                html += '</div>'
                                html += '</td>';
                                html += '<td class="clientname">' + a.ClientName + ' </td><td class="invMatterName">' + a.MatterName + ' </td><td class="invdate">' + formatDatetoIST(a.invdate) + '</td><td class="invamount">' + a.TotAmt + '</td><td class="PaidAmt">' + a.PaidAmt + '</td><td class="PaymentType"><span style="' + paymentcursor + '" id="OpenPayment" data-id="' + a.id + '" data-paymentype="' + a.PaymentType + '">' + a.PaymentType + '</span></td><td class="ChequeStatus"><span style="' + statuscursor + '" id="OpenPaymentStatus" data-id="' + a.id + '" data-paymentype="' + a.ChequeStatus + '">' + a.ChequeStatus + '</span></td><td class="famt">' + famt + '</td><td class="Inovicedate">' + formatDatetoIST(a.Inovicedate) + '</td><td class="icreatedby">' + a.CreatedBy + '</td><td class="cdate">' + formatDatetoIST(a.duedate) + '</td><td class="Invoicetype">' + a.Invoicetype + '</td><td class="InvoiceStatus">' + a.InvoiceStatus + '</td>';
                                html += '<td class="invdownload"> <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="o" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">O</a>';
                                for (var i = 1; i <= a.AmendCount; i++) {
                                    html += '| <a name="' + a.InvoiceNo + '" data-val="' + a.id + '" data-type="' + i + '" id="viewinvoicedata" href="javascript:void()" style="padding: 1px 5px 1px 4px;font-weight:bold">' + i + '</a>';
                                }
                                html += '</td>';
                                html += '</tr>';
                            }
                        }
                    }
                });
                $("#assignuserdata").html(html);
                closeload();
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
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
            return false;
        });
    }
    /*Pagination Start*/
    var isRenderPage = false;
    var totalPageRec = "";
    //function renderPagination(pageindex, totdata) {
    //    let totPages = totdata;
    //    setPageNo = pageindex;
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
    //    $("#prev").toggleClass("disabled", pageindex === 1);
    //    $("#next").toggleClass("disabled", pageindex === totdata);
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

    var setPageNo = 1;
    //$(document).on("click", ".page-btn", function () {
    //    let page = $(this).data("page");
    //    setPageNo = page;
    //    //if (page) changePage(page);
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadInvoicedata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});

    $(document).on("click", ".page-btn", function () {
        let page = $(this).data("page");
        setPageNo = page;
        //if (page) changePage(page);
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        loadInvoicedata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#prev").click(function () {

    //    if (setPageNo > 1) {
    //        setPageNo = setPageNo - 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadInvoicedata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#prev").click(function () {

        if (setPageNo > 1) {
            setPageNo = setPageNo - 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        //renderPagination(setPageNo, totalPageRec)
        loadInvoicedata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#next").click(function () {
    //    if (setPageNo => 1) {
    //        setPageNo = setPageNo + 1;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    $("#txtgopage").val("");
    //    loadInvoicedata(setPageNo);
    //    $(".page-btn").removeClass("active");
    //    $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    //});
    $("#next").click(function () {
        if (setPageNo => 1) {
            setPageNo = setPageNo + 1;
        }
        loadflag = true;
        isRenderPage = false;
        $("#txtgopage").val("");
        loadInvoicedata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });

    //$("#divGo").click(function () {
    //    let goToPage = parseInt($("#txtgopage").val());
    //    if (!isNaN(goToPage)) {
    //        setPageNo = goToPage;
    //    }
    //    loadflag = true;
    //    isRenderPage = true;
    //    loadInvoicedata(setPageNo);
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
        PageNumber = setPageNo;
        isRenderPage = false;
        loadInvoicedata(setPageNo);
        $(".page-btn").removeClass("active");
        $(".page-btn[data-page='" + setPageNo + "']").addClass("active");
    });


    /*Pagination End*/
    /*View invoice data*/
    $(document).on("click", "#viewinvoicedata", function () {
        var token = $(this).attr("data-val");
        var invtype = $(this).attr("data-type");
        var host = window.location.host
        var url = "/" + fcode + "/Bill/PrintInvoiceDetail?data=true&token=" + token + "&invtype=" + invtype;
        window.open("" + url + "", "_blank");
    });
    $("#searchdatas").click(function () {
        var cnamefilter = $("#searchname").val();
        var fromfilter = $("#searchfrom").val();
        var tofilter = $("#searchto").val();
        var amountfilter = "";
        var matterid = $("#mattername").val();
        if (cnamefilter == "" && fromfilter == "" && tofilter == "" && amountfilter == "" && matterid == "") {
            searchflag = 0;
        }
        else {
            searchflag = 1;
        }
        var date1 = new Date(fromfilter);
        var date2 = new Date(tofilter);
        if (fromfilter != "" && tofilter != "") {
            if (date1 > date2) {
                alert("To date should not be less than Start date");
                return false;
            }
        }
        if (fromfilter == "" && tofilter != "") {
            alert("select start/end date");
            return false;
        }
        isRenderPage = false;
        loadInvoicedata(1);
    });
    $('#divcontent').off("click").on('click', '#invgetdatabypagenum', function () {
        pageindex = $("#invpagnumvalue").val();
        if (pageindex != "undefined") {
            if (Math.sign(pageindex) == 1) {
                var ppageindesx = $("#invsotopage").text();
                if (pageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadInvoicedata(pageindex);
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
    var chksflag = true;
    $(document).on('click', '#invpaginate', function () {
        pageindex = $(this).attr("index");
        loadInvoicedata(pageindex);
    });

    /*Load contact details*/
    function loadcontact1() {
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/CallApi/SpClientData',
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
                $("#searchname option").remove();
                var option = '<option value="" selected>Select</option>';
                $("#searchname").append(option);
                $.each(obj, function (i, a) {
                    if (a.Username == null || a.Username == "" || a.Username == "null") {
                        var option = '<option value="' + a.LoginId + '" >' + a.fname + ' ' + a.lname + '</option>';
                        $("#searchname").append(option);
                    }
                    else {
                        var option = '<option value="' + a.LoginId + '" >' + a.Username + ' (' + a.cufname + ') </option>';
                        $("#searchname").append(option);
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
    $(document).on('change', '#searchname', function () {
        var clientid = $('#searchname').val();
        if (clientid != "") {
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/callApi/LoadMatterforclient",
                headers: {
                    "clientid": clientid,
                    "companyids": ""
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    $("#mattername").empty();
                    var obj = JSON.parse(response.Data);
                    var optiontempy = '<option value="" >All</option>';
                    $("#mattername").append(optiontempy);
                    $.each(obj, function (i, a) {
                        var mattername = a.mname;
                        var mid = a.Id;
                        if (mattername == null) {
                            mattername = "";
                            mid = "";
                        }
                        else {
                            var option = '<option value="' + mid + '" > ' + mattername + '</option>';
                            $("#mattername").append(option);
                        }
                    });
                    try {
                        closeload();
                    }
                    catch
                    {
                    }
                },
                failure: function (response) {
                    alert(data.responseText);
                    try {
                        closeload();
                    }
                    catch
                    {
                    }
                },
                error: function (response) {
                    alert(data.responseText);
                    try {
                        closeload();
                    }
                    catch
                    {
                    }
                }
            });
        }
        else {
            var optiontempy = '<option value="" >Select</option>';
            $("#mattername").empty().append(optiontempy);
        }
    });

    $(document).on('change', '.chkdhide', function () {
        // your code
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });
});