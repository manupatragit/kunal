$(document).ready(function () {
    SeriesAry = [];
    SeriesAry.push({ Id: 4, Type: "StartSeries", Value1: "1", Value2: "", Sequence: 4 });
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("change", "#Seq1,#Seq2,#Seq3,#Seq4", function () {
        var value = $(this).val();
        var Id = $(this).attr("data-id");
        if (value >= 1 && value <= 4) {
            UpdateraySeq(value, Id);
        }
        else {
            var ids = $(this).attr("Id");
            $("#" + ids).val(1);
            UpdateraySeq(1, Id);
        }
    });
    $(document).on("click", "#chk1,#chk2,#chk3,#chk4,#chk5", function () {
        var Id = $(this).val();
        if ($(this).is(':checked')) {
            var Type = "";
            if (Id == 1) { Type = "PrefixSuffix" }
            else if (Id == 2) { Type = "Month" }
            else if (Id == 3) { Type = "FTCY" }
            else if (Id == 4) { Type = "StartSeries" }
            else if (Id == 5) { Type = "Operator" }
            var Value1 = $("#format" + Id).val();
            var Value2 = $("#Value" + Id).val();
            var Seq = $("#Seq" + Id).val();
            if (String(Value2) == "undefined") {
                Value2 = "";
            }
            if (String(Seq) == "undefined") {
                Seq = 0;
            }
            SeriesAry.push({ Id: parseInt(Id), Type: Type, Value1: Value1, Value2: Value2, Sequence: parseInt(Seq) });
        } else {
            PopData(Id);
        }
    });
    /*Update ray seq*/
    function UpdateraySeq(values, Ids) {
        Id = parseInt(Ids)
        var value = parseInt(values);
        //update value
        let index2 = SeriesAry.map(function (e) {
            return e.Id
        }).indexOf(Id);
        var datakeyvalue = SeriesAry.find(x => x.Id == Id);
        if (String(datakeyvalue) != "undefined") {
            SeriesAry[index2].Sequence = value;
        }
    }
    /*Update ray*/
    function Updateray(value, Ids) {
        Id = parseInt(Ids)
        //update value
        let index2 = SeriesAry.map(function (e) {
            return e.Id
        }).indexOf(Id);
        var datakeyvalue = SeriesAry.find(x => x.Id == Id);
        if (String(datakeyvalue) != "undefined") {
            SeriesAry[index2].Value1 = value;
        }
    }
    /*Update ray2*/
    function Updateray2(value, Ids) {
        Id = parseInt(Ids)
        //update value
        let index2 = SeriesAry.map(function (e) {
            return e.Id
        }).indexOf(Id);
        var datakeyvalue = SeriesAry.find(x => x.Id == Id);
        if (String(datakeyvalue) != "undefined") {
            SeriesAry[index2].Value2 = value;
        }
    }
    $(document).on("change", ".UpdateValue1", function () {
        var Id = $(this).attr("data-id");
        var value = $(this).val();
        Updateray(value, Id);
    });
    $("#format4").keyup(function () {
        var Id = 4;
        var value = $(this).val();
        //update value
        Updateray(value, Id);
    });
    $("#Value1").keyup(function () {
        var Id = 1;
        var value = $(this).val();
        Updateray2(value, Id);
    });
    $(document).on("change", "#Value3", function () {
        var Id = 3;
        var value = $(this).val();
        Updateray2(value, Id);
    });
    function PopData(Ids) {
        var Id = parseInt(Ids);
        let index2 = SeriesAry.map(function (e) {
            return e.Id
        }).indexOf(Id);
        SeriesAry.splice(index2, 1);
    }
    $(document).on("click", "#edirinvoiceseries", function () {
        var token = $(this).attr("data-val");
        //window.location = "/" + fcode + "/Bill/EditInvoiceSeries?data=true&token=" + token;
        var urls = encodeURI("/" + fcode + "/Bill/EditInvoiceSeries");
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token }
        });
    });
    $("#format3").change(function () {
        document.getElementById("Value3").selectedIndex = "0";
        if ($(this).val() == "FY") {
            $("#Value3").show();
        }
        else {
            $("#Value3").hide();
        }
        var Id = 3;
        Updateray("", Id);
    });
    function openload1() {
        // $('#myOverlay1').css("display", "block");
    }
    function closeload() {
        // $('#myOverlay1').css("display", "none");
    }
    function sortByKeyDesc(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
    function sortByKeyAsc(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
    $("#PreviewSeries,#saveinvseries").click(function () {
        sortByKeyAsc(SeriesAry, "Sequence")
        console.log(JSON.stringify(SeriesAry));
        //validate valie1 mandatory
        for (var i = 0; i < SeriesAry.length; i++) {
            if (SeriesAry[i].Value1 == "") {
                if (SeriesAry[i].Type == "StartSeries") {
                    alert("Please enter Increment Invoice Number");
                    $("#format4").focus();
                    return false;
                }
            }
            if (SeriesAry[i].Value2 == "") {
                if (SeriesAry[i].Type == "PrefixSuffix") {
                    alert("Please enter Invoice Series Code");
                    $("#Value1").focus();
                    return false;
                }
            }
        }
        //validate sequnce
        var AllSeq = [];
        for (var i = 0; i < SeriesAry.length; i++) {
            if (String(SeriesAry[i].Sequence) != "NaN") {
                AllSeq.push(SeriesAry[i].Sequence);
            }
            //find duplicate method
            const duplicates = AllSeq.filter((item, index) => index !== AllSeq.indexOf(item));
            if (duplicates != "") {
                alert("Sequence " + duplicates + " can not be duplicate");
                return false;
            }
        }
        console.log(AllSeq);
        FinalPreview(AllSeq, $(this).attr("id"));
        //create Proview
    });
    function ResetArrayForm() {
        $("#srno").val("");
        $("#seriescode").val("");
        $("#FormatMonth").val("");
        $("#FormatFYCY").val("");
        $("#FormatOperator").val("");
        $("#FormatSequence").val("");
        $("#FormatPreview").val("");
        $("#FormatSeriesArray").val("");
    }
    var FinalSequenceAry = [];
    function FinalSequencePush(SeqAryValue) {
        CheckExist = FinalSequenceAry.indexOf(SeqAryValue);
        if (CheckExist === -1) {
            FinalSequenceAry.push(SeqAryValue);
        }
    }
    function FinalPreview(SelectedSeq, targetId) {
        ResetArrayForm();
        var InvoiceNo = "";
        var FinalSequence = "";
        FinalSequenceAry = [];
        var Prefix = "TEST";
        var Suffix = "";
        var month = "mm";
        var StartSeries = "1";
        var Operator = "/";
        var FTCY = "FY";
        //get operator value
        OperatorValue = "";
        OperatorValueSeq = "";
        var OperatorValuecheck = SeriesAry.filter(x => x.Type == "Operator");
        if (String(OperatorValuecheck) == "") {
            OperatorValue = "";
            OperatorValueSeq = "";
        }
        else {
            OperatorValue = OperatorValuecheck[0].Value1;
            OperatorValueSeq = "{O}";
        }
        $("#FormatOperator").val(OperatorValue);
        for (var i = 0; i < SeriesAry.length; i++) {
            if (SeriesAry[i].Type == "PrefixSuffix") {
                if (SeriesAry[i].Value1 == "Prefix") {
                    Prefix = SeriesAry[i].Value1;
                    InvoiceNo += SeriesAry[i].Value2 + OperatorValue;
                    FinalSequencePush('{IC}');
                }
                else {
                    Suffix = SeriesAry[i].Value1;
                    InvoiceNo += SeriesAry[i].Value2 + OperatorValue;
                    FinalSequencePush('{IC}');
                }
                $("#seriescode").val(SeriesAry[i].Value2);
            }
            if (SeriesAry[i].Type == "Month") {
                var MonthValue = SeriesAry[i].Value1;
                if (MonthValue == "MMM") {
                    MonthValue = getMonthMMM();
                    FinalSequencePush('{MMM}');
                }
                else {
                    MonthValue = getMonth();
                    FinalSequencePush('{mm}');
                }
                InvoiceNo = InvoiceNo + MonthValue + OperatorValue;
                $("#FormatMonth").val(SeriesAry[i].Value1);
            }
            if (SeriesAry[i].Type == "FTCY") {
                if (SeriesAry[i].Value1 == "FY") {
                    var FTCTValue = SeriesAry[i].Value2;
                    FTCTValue = getYearFY(SeriesAry[i].Value2);
                    InvoiceNo = InvoiceNo + FTCTValue + OperatorValue;
                    $("#FormatFYCY").val(SeriesAry[i].Value2);
                    FinalSequencePush('{' + SeriesAry[i].Value2 + '}');
                }
                else {
                    var FTCYValue = SeriesAry[i].Value1;
                    FTCYValue = getYearCY();
                    InvoiceNo = InvoiceNo + FTCYValue + OperatorValue;
                    $("#FormatFYCY").val(SeriesAry[i].Value1);
                    FinalSequencePush('{CY}');
                }
            }
            if (SeriesAry[i].Type == "StartSeries") {
                var StartSeriesValue = SeriesAry[i].Value1;
                InvoiceNo = InvoiceNo + StartSeriesValue + OperatorValue;
                $("#srno").val(SeriesAry[i].Value1);
                FinalSequencePush('{S}');
            }
        }
        if (Suffix != "") {
            //InvoiceNo = InvoiceNo + Suffix
        }
        if (OperatorValue != "") {
            InvoiceNo = InvoiceNo.slice(0, -1);
        }
        $("#Previewtext").html(InvoiceNo);
        for (var i = 0; i < FinalSequenceAry.length; i++) {
            if (i == (FinalSequenceAry.length - 1)) {
                FinalSequence = FinalSequence + FinalSequenceAry[i];
            }
            else {
                FinalSequence = FinalSequence + FinalSequenceAry[i] + OperatorValueSeq;
            }
        }
        $("#Previewtext1").html(FinalSequence);
        $("#FormatSequence").val(FinalSequence);
        $("#FormatPreview").val(InvoiceNo);
        $("#FormatSeriesArray").val(JSON.stringify(SeriesAry));
        if (String(targetId) == "saveinvseries") {
            saveinvseries();
        }
    }

    /*Generate year*/
    function getYearFY(format) {
        var dates = "";
        if (format == "FY") {
            var date = new Date();
            dates = date.getFullYear() + "-" + (date.getFullYear() + 1);
        }
        else if (format == "FYS") {
            var date = new Date();
            dates = date.getFullYear().toString().substr(-2) + "-" + (date.getFullYear() + 1).toString().substr(-2);
        }
        else if (format == "FYFS") {
            var date = new Date();
            dates = date.getFullYear().toString().substr(-2) + "-" + (date.getFullYear() + 1);
        }
        else if (format == "FYLS") {
            var date = new Date();
            dates = date.getFullYear() + "-" + (date.getFullYear() + 1).toString().substr(-2);
        }
        return dates;
    }
    function getYearCY() {
        var date = new Date();
        return (date.getFullYear());
    }
    function getMonth() {
        var date = new Date();
        return (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    }
    function getMonthMMM() {
        let date = new Date(); // 2020-06-21
        return date.toLocaleString('en-us', { month: 'short' }); /* Jun */
    }
    /*Save service*/
    function saveinvseries() {
        var year = '';
        var srno = $("#srno").val();
        var seriescode = $("#seriescode").val();
        if (seriescode != "") {
            if (seriescode.length > 6) {
                new PNotify({
                    title: 'Warning!',
                    text: ' Series code cannot be of more than six Characters',
                    type: 'error',
                    delay: 3000
                });
                return false;
            }
        }
        if (srno == "") {
            new PNotify({
                title: 'Warning!',
                text: 'Please enter the starting series no. ',
                type: 'error',
                delay: 3000
            });
            return false;
        }
        var FormatMonth = $("#FormatMonth").val();
        var FormatFYCY = $("#FormatFYCY").val();
        var FormatOperator = $("#FormatOperator").val();
        var FormatSequence = $("#FormatSequence").val();
        var FormatPreview = $("#FormatPreview").val();
        var FormatSeriesArray = $("#FormatSeriesArray").val();
        var formData = new FormData();
        formData.append("srno", EncodeText(srno));
        formData.append("seriescode", EncodeText(seriescode));
        formData.append("FormatMonth", EncodeText(FormatMonth));
        formData.append("FormatFYCY", EncodeText(FormatFYCY));
        formData.append("FormatOperator", EncodeText(FormatOperator));
        formData.append("FormatSequence", EncodeText(FormatSequence));
        formData.append("FormatPreview", EncodeText(FormatPreview));
        formData.append("FormatSeriesArray", EncodeText(FormatSeriesArray));
        $.ajax({
            url: '/api/OcrInvoiceApi/PostSaveInvoiceSeries',
            data: formData,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "alreadyexist") {
                        new PNotify({
                            title: 'warning!',
                            text: 'You have already created invoice series.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (parseInt(response.Data) > 0) {
                        $("#fileupload")[0].reset();
                        new PNotify({
                            title: 'Success!',
                            text: ' Invoice Series created successfully',
                            type: 'success',
                            delay: 3000
                        });
                        LoadInvoiceseries();
                        location.reload();
                    }
                    else {
                        new PNotify({
                            title: 'warning!',
                            text: 'somwthing went wrong..',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                }
                else {
                    // alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
    }
    /*Remove invoice series*/
    $(document).on("click", "#removeinvoiceseries", function () {
        var formData = new FormData();
        var ids = $(this).attr("data-val");
        formData.append("ids", ids);
        var result = confirm("Are you sure want to delete invoice series ?");
        if (result) {
            if (ids != "") {
                $.ajax({
                    async: true,
                    type: "POST",
                    url: "/api/OcrInvoiceApi/RemoveInvoiceseries",
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response.Status == true && response.Data == "1") {
                            new PNotify({
                                title: 'Success!',
                                text: ' Invoice Series Removed Successfully',
                                type: 'success',
                                delay: 3000
                            });
                            LoadInvoiceseries();
                        }
                        else {
                            new PNotify({
                                title: 'Fail!',
                                text: ' Something went wrong!',
                                type: 'success',
                                delay: 3000
                            });
                            LoadInvoiceseries();
                        }
                    },
                    error: function () {
                        // closeload();
                    }
                });
            }
            else {
                new PNotify({
                    title: 'Warning',
                    text: ' Please select a row to delete.',
                    type: 'error',
                    delay: 3000
                });
            }
        }
    });
});
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
var searchvar = "";
LoadInvoiceseries();
/*Load invoice series*/
function LoadInvoiceseries() {
    var html = '';
    $("#assignuserdata").html("");
    var formData = new FormData();
    formData.append("search", EncodeText(searchvar));
    //read assign using list
    qty1 = 0;
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/OcrInvoiceApi/LoadInvoiceseries",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            var datas1 = JSON.stringify(response1);
            var obj = JSON.parse(response1.Data);
            $.each(obj, function (i, a) {
                qty1 = qty1 + 1;
                var newids = "";
                try {
                    newids = a.Id;
                }
                catch (er) {
                }
                html += '<tr><td>' + a.SeriesCode + '</td><td>' + a.StartSeries + '</td><td>' + a.CreatedBy + '</td><td><span name=' + a.date_time + '>' + formatDatetoIST(a.date_time) + '</span></td><td>' + a.FormatPreview + '</td><td> <span id="removeinvoiceseries" title="Remove invoice series" data-val="' + newids + '"><img src="/newassets/img/deletecasesingle-icon.png" height="32" width="32" /></span></td></tr>';
            });
            $("#assignuserdata").append(html);
            getPagination1('#ocrlist');
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}

/*Generate paginate*/
function getPagination1(table) {
    $('.pagination').html('');						// reset pagination
    var trnum = 0;									// reset tr counter
    var maxRows = 15;
    //alert(maxRows);
    // alert(maxRows);// get Max Rows from select option
    var totalRows = $(table + ' tbody tr ').length;
    // alert(totalRows);// numbers of rows
    $('#ocrlist tbody tr').each(function () {			// each TR in  table and not the header
        trnum++;
        //alert(trnum);// Start Counter
        if (trnum > maxRows) {						// if tr number gt maxRows
            $(this).hide();							// fade it out
        } if (trnum <= maxRows) { $(this).show(); }// else fade in Important in case if it ..
    });											//  was fade out to fade it in
    if (totalRows > maxRows) {						// if tr total rows gt max rows option
        var pagenum = Math.ceil(totalRows / maxRows);
        // alert(pagenum);// ceil total(rows/maxrows) to get ..
        //	numbers of pages
        for (var i = 1; i <= pagenum;) {			// for each page append pagination li
            $('.pagination').append('<li data-page="' + i + '">\
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <span>'+ i++ + '<span class="sr-only">(current)</span></span>\
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </li>').show();
        }											// end for i
    } 												// end if row count > max rows
    $('.pagination li:first-child').addClass('active'); // add active class to the first li
    $('.pagination li').on('click', function () {		// on click each page
        var pageNum = $(this).attr('data-page');
        // alert(pageNum);// get it's number
        var trIndex = 0;							// reset tr counter
        $('.pagination li').removeClass('active');	// remove active class from all li
        $(this).addClass('active');					// add active class to the clicked
        $('#ocrlist tbody tr').each(function () {		// each tr in table not the header
            trIndex++;
            // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
            if (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) {
                $(this).hide();
            } else { $(this).show(); } 				//else fade in
        }); 										// end of for each tr in table
    });										// end of on click pagination list
    // end of on select change
    // END OF PAGINATION
}
