var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
$(document).ready(function () {
    var ecpageindex = 1, ecpagesize = 10;
    /*Open loader*/
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    /*Close loader*/
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    LoadExpenseData(ecpageindex)
    /*Load expense data*/
    $(document).on('click', '#btnsearch', function () {
        $("#clearnewseach").show();
        LoadExpenseData(ecpageindex);
    });
    /*clear search details*/
    $(document).on('click', '#clearnewseach', function () {
        $("#clearnewseach").hide();
        $("#name,#datefrom,#dateto").val("");
        LoadExpenseData(ecpageindex);
    });
    /*Load expense details*/
    function LoadExpenseData(ecpageindex) {
        $("#ecfooterexp").empty();
        var html3 = '';
        var tfot = '';
        var tfot1 = '';
        var formdata = new FormData();
        var name = $('#name').val();
        var datefrom = $('#datefrom').val();
        var dateto = $('#dateto').val();
        formdata.append("name", EncodeText(name));
        formdata.append("datefrom", EncodeText(datefrom));
        formdata.append("dateto", EncodeText(dateto));
        formdata.append("pagenum", EncodeText(ecpageindex));
        formdata.append("pagesize", EncodeText(ecpagesize));
        formdata.append("loginuserid", EncodeText(userDetails.Id));
        formdata.append("firmid", EncodeText(userDetails.FirmId));
        openload();
        var sct1 = $.ajax({
            async: true,
            type: "POST",
            url: "/Tools/CompareDocumentList",
            dataType: 'json',
            data: formdata,
            contentType: false,
            processData: false,
            success: function (response1) {
                $("#ecfootercompare").empty();
                if (response1 != "") {
                    var length = response1.length;
                    $.each(response1, function (i, a) {
                        if (i === 0) {
                            firstvalue = a.rownum;
                        }
                        if (i === (length - 1)) {
                            var pnext = ecpageindex;
                            var pprev = ecpageindex;
                            var pageno = ecpageindex;
                            var totdata = a.totRow;
                            var totpage = 0;
                            if (a.totRow > 0) {
                                pnext = parseInt(pnext) + 1;
                                if (pnext == 0) pnext = 1;
                                pprev = parseInt(pageno) - 1;
                                if (pprev == 0) pprev = 1;
                                totpage = parseInt(totdata) / parseInt(ecpagesize);
                                if (parseInt(totdata) % parseInt(ecpagesize) != 0) {
                                    totpage = parseInt(totpage) + 1;
                                }
                                $("#comparecpagnumvalue").attr("max", totpage);
                            }
                            tfot += '<li>results <span>' + totdata + '</span>  <span id="comparesotopage" style="display:none">' + totpage + '</span></li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + ecpageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li ><input type="number" id="comparecpagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="comparecgetpagnumvalue" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                            tfot += '<li>'
                            if (a.totRow <= length) { }
                            else if (pageno == 1) { }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="comparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                            }
                            else {
                                tfot += '<li><span><a id="comparepaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                            }
                            if (pageno < totpage) {
                                tfot += '<a id="comparepaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a></span>'
                            }
                            $("#ecfootercompare").append(tfot);
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
                        html3 += '<span id="vCompName" >' + vCompName + '</span>'
                        html3 += '</td>'
                        html3 += '<td class="vFCompURL">'
                        if (a.linkexpired == '0') {
                            html3 += '<span id="vFCompURL"><a href="#" id="view" data-val=' + vFCompURL + '><i class="glyphicon glyphicon-eye-open"></i></a></span> | <span><a href="#" id="DeleteComparedoc" data-val=' + compId + '><span class="glyphicon glyphicon-trash" style="color:red;"></span></a></a></span>'
                        } else {
                            html3 += '<span id="vFCompURL">Expired </span>  | <span><a href="#" id="DeleteComparedoc" data-val=' + compId + '><span class="glyphicon glyphicon-trash" style="color:red;"></span></a></a></span>'
                        }
                        html3 += '</td>'
                        html3 += '<td class="dexpiryDate">'
                        html3 += '' + dexpiryDate + ''
                        html3 += '</td>'
                        html3 += '</tr>'
                    });
                    $("#doclist").html(html3);
                    closeload();
                }
                else {
                    html3 = '<tr><td colspan=11 style="text-align:center">No result found !</td></tr>'
                    $("#doclist").html(html3);
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
        $(document).on('click', '#view', function () {
            var token = $(this).attr("data-val");
            $("#frmcompare").attr("src", token);
            $("#comparemodal").show();
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
        var column = "." + $(this).attr("name");
        $(column).toggle();
    });

    /*Delete compare docs*/
    $(document).on('click', '#DeleteComparedoc', function () {
        if (confirm("Are you sure want to delete this file!")) {
            var uCGuid = $(this).attr("data-val");
            var formData = new FormData();
            formData.append("uCGuid", EncodeText(uCGuid));
            $.ajax({
                async: true,
                type: "POST",
                url: "/Tools/RemoveCompareDoc",
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
    $(document).on('click', '#comparepaginate', function () {
        /* your code here */
        ecpageindex = $(this).attr("index");
        LoadExpenseData(ecpageindex);
    });
    function openload() {
        $("#myOverlay").css("display", "block");
    }
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
    function loadquata() {
        var formData = new FormData();
        formData.append("firmid", EncodeText(userDetails.FirmId));
        $.ajax({
            async: true,
            type: "POST",
            url: "/Tools/CompareDocQuota",
            dataType: 'json',
            data: formData,
            // data: null,
            contentType: false,
            processData: false,
            success: function (response1) {
                if (response1 != "") {
                    var length = response1.length;
                    $.each(response1, function (i, a) {
                        $('#totdoc').html(a.totdoc);
                        $('#totleftdoc').html(a.leftdoc);
                        $('#totuseddoc').html(a.usedtotdoc);
                        $('#totdeleteddoc').html(a.deleteddoc);
                    });
                }
                //var obj = JSON.parse(response1.Data);
            },
            failure: function (data) {
            },
            error: function (data) {
            }
        });
    }
/*Delete compare docs*/
    function fn_DeleteComparedoc(uCGuid) {
        if (confirm("Are you sure want to delete this document!")) {
            var formData = new FormData();
            formData.append("uCGuid", EncodeText(uCGuid));
            formdata.append("loginuserid", EncodeText(userDetails.Id));
            formdata.append("firmid", EncodeText(userDetails.FirmId));
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
