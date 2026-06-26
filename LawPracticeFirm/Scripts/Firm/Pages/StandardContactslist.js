$(document).ready(function () {
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    var cpageindex = 1, cpagesize = 10, crecordcount = 0, ctotrecord = 0;
    var opageindex = 1, opagesize = 10, orecordcount = 0, ototrecord = 0;
    var alpageindex = 1, alpagesize = 10, alrecordcount = 0, altotrecord = 0;
    var cpageindexcom = 1, cpagesizecom = 10, recordcountcom = 0, totrecordcom = 0;
    $('.import_client').click(function () {
        var fcode = localStorage.getItem("FirmCode");
        window.location = encodeURI("/" + fcode + "/firm/ImportClient");
    });
    openload();
    allloadtabledata();
    $('div .dropdown-menu').on('click', function (event) {
        // The event won't be propagated up to the document NODE and 
        // therefore delegated events won't be fired
        if (String(event.target.nodeName) != "P") {
            event.stopPropagation();
        }
    });
    var fcode = localStorage.getItem("FirmCode");
    $(document).on("click", "#filelink", function () {
        openload();
        var fileid = $(this).attr("id-val");
        var mode = "view";
        var url = "/firm/multiplefilelist/?ftype=Lead&data=" + fileid + "&mode=" + mode;
        $('.mymodels').load(url, function (result) {
            closeload();
            $('#myModal').modal({ show: true });
        });
    });
    var cexportfilter = false;
    $("#ocallexcel,#cexcel,#excel,#oexcel").click(function () {
        var searchdata = $('#searchdata').val().replace(/\"/g, '').replace(/\'/g, '');
        var pagetype = $('#Clistctype').val();
        var category = $('#iscomorindividual').val();
        var type = "";
        if ($(this).attr("id") == "ocallexcel") {
            type = "All"
        }
        if ($(this).attr("id") == "cexcel") {
            type = "CLIENT"
        }
        window.location = encodeURI("/firm/ExportoExcelAllStandardContactList?status=true&searchdata=" + searchdata + "&TYPE=" + type + "&pagetype=" + pagetype + "&category=" + category);
    })
    $("#ocallpdf,#cpdf,#pdf,#opdf").click(function () {
        var searchdata = $('#searchdata').val().replace(/\"/g, '').replace(/\'/g, '');
        var pagetype = $('#Clistctype').val();
        var category = $('#iscomorindividual').val();
        var type = "";
        if ($(this).attr("id") == "ocallpdf") {
            type = "All"
        }
        if ($(this).attr("id") == "cpdf") {
            type = "CLIENT"
        }
        window.location = encodeURI("/firm/ExportoPDFAllStandardContactList?status=true&searchdata=" + searchdata + "&TYPE=" + type + "&pagetype=" + pagetype + "&category=" + category);
    })
    setInterval(function () {
        var tempcases = localStorage.getItem("shortcontact");
        var lists2 = $("#Clistctype option:selected").text();
        if (tempcases != "") {
            if (lists2 == "Prospect") {
                $("#Propectdiv").css("display", "block");
                $("#clientdiv").css("display", "none");
                $("#otherdiv").css("display", "none");
                $("#allcontactsdiv").css("display", "none");
                ploadtabledata();
            }
            else if (lists2 == "Client") {
                $("#Propectdiv").css("display", "none");
                $("#clientdiv").css("display", "block");
                $("#otherdiv").css("display", "none");
                $("#allcontactsdiv").css("display", "none");
                cloadtabledata();
            }
            else if (lists2 == "All") {
                $("#Propectdiv").css("display", "none");
                $("#clientdiv").css("display", "none");
                $("#otherdiv").css("display", "none");
                $("#allcontactsdiv").css("display", "block");
                allloadtabledata();
            }
            else {
                $("#Propectdiv").css("display", "none");
                $("#clientdiv").css("display", "none");
                $("#otherdiv").css("display", "block");
                $("#allcontactsdiv").css("display", "none");
                oloadtabledata();
            }
            localStorage.setItem("shortcontact", "");
        }
    }, 2000);
    /*Special character pass*/
    function specialcharecterpass(str) {
        var strretrn = "0";
        var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in password.");
                document.getElementById("clnpassword").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }

    function specialcharectercpass(str) {
        var strretrn = "0";
        var iChars = "`()+=[]\\\';,./{}|\":<>_ ";
        var data = str.val();
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert(" `()+=[]\\\';,./{}|\":<>_   Special character not allowed in password.");
                document.getElementById("clcpassword").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    function specialcharecter() {
        var strretrn = "0";
        var iChars = "!`%^*()+=-[]\\\';,/{}|\":<>?~ ";
        var data = document.getElementById("clusername").value;
        for (var i = 0; i < data.length; i++) {
            if (iChars.indexOf(data.charAt(i)) != -1) {
                alert("Special characters and spaces are not allowed in the User Id.");
                document.getElementById("clusername").focus();
                strretrn = "1";
                break;
            }
        }
        return strretrn;
    }
    $(document).on("click", "#CreateClientlogin", function () {
        var token = $(this).attr("data-val");
        $("#cltoken").val(token);
        $("#frmpass")[0].reset();
        $('#myModalccc').modal({ show: true });
    });
    //start Cfield history
    $("#ExporttoExcelCFHistory").click(function () {
        var chkArray3 = [];
        var selected = $("#cfod input[type='checkbox']:checked");
        selected.each(function () {
            chkArray3.push($(this).val());
        });
        var selected3;
        selected3 = chkArray3.join(',');
        if (selected3.length > 0) {
        }
        var vdate = $('#cfversion').val();
        if (vdate == "") {
            alert("Please select custom field version.");
            return false;
        }
        window.location = encodeURI("/firm/ExportoExcelCustomFieldContact?status=true&vdate=" + vdate + "&type=" + type + "&exportcolumn=" + selected3);
    })

    /*Bind custom field history version*/
    var cfloadflag = true;
    var cfpageindex = 1, cfpagesize = 10, cfrecordcount = 0, cftotrecord = 0;
    function bindCFHistoryversion() {
        $("#cfversion").empty();
        var html1 = '<option value="">Select</option>';
        var formData = new FormData();
        formData.append("ModuleType", EncodeText(type));
        var it = 0;
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomFieledVersion",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                var obj = JSON.parse(response.Data);
                if (obj != "") {
                    var array = String(obj).split(",");
                    $.each(array, function (i) {
                        it = it + 1;
                        html1 += '<option value="' + array[i] + '" >Version-' + it + '(' + formatDatetoIST(array[i]) + ')</option>';
                    });
                }
                $("#cfversion").html(html1);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $("#cfHistory").click(function () {
        $('#myModalcfHistory').modal({ show: true });
        bindCFHistoryversion();
    });
    $("#CFHistoryData").click(function () {
        var vdate = $("#cfversion").val();
        if (vdate == "") {
            alert("Please select Version of Custom Fields");
            $("#cfversion").focus();
            return false;
        }
        $("#CFHistoryData").attr("disabled", true);
        cfhistorydata();
    });
    $(document).on('click', '#cfpgetdatabypagenum', function () {
        ppageindex = $("#cfppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#cfpsotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadflag = true;
                    loadCfieldList(ppageindex);
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
    var chksflag = true;
    $(document).on('click', '#cfppaginate', function () {
        ppageindex = $(this).attr("index");
        loadflag = true;
        loadCfieldList(ppageindex);
    });
    var countcustomfieldCF = 0;
    var defaultcolumncount = 5;
    /*Custom field history data*/
    function cfhistorydata() {
        $('#cfheadrow').empty();
        $("#cfod").empty();
        var q1 = 2;
        var columnvalue = 0;
        var sort = 0;
        var vdate = $("#cfversion").val();
        var formData = new FormData();
        formData.append("VersionDate", EncodeText(vdate));
        formData.append("ModuleType", EncodeText(type));
        var rt1 = $.ajax({
            async: true,
            type: "POST",
            url: "/api/CallApi/LoadCustomFieledHeader",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfieldCF = obj.length;
                    var $header = "";
                    var option = "";
                    var checkvalue = "checked";
                    var headerhsvalue = "display:table-cell";
                    $header += '<th class="cfcontactype"> <div class="thbg">Contact Type</div> </th>';
                    $header += '<th class="cffname"><div class="thbg"> First Name</div> </th>';
                    $header += '<th class="cflname"><div class="thbg"> Last Name </div></th>';
                    $header += '<th class="cfmobile"><div class="thbg"> Mobile </div></th>';
                    $header += '<th class="cfemail"><div class="thbg"> Email</div> </th>';
                    option += '<li><input  checked class="chkdhide"  type="checkbox" value="ContactType"  name="cfcontactype" ><a href="#" class="small" data-value="option " tabIndex="-1">Contact Type</a></li>';
                    option += '<li><input  checked class="chkdhide"  type="checkbox" value="FirstName"  name="cffname" ><a href="#" class="small" data-value="option " tabIndex="-1">First Name</a></li>';
                    option += '<li><input  checked class="chkdhide"  type="checkbox" value="LastName"  name="cflname" ><a href="#" class="small" data-value="option " tabIndex="-1">Last Name</a></li>';
                    option += '<li><input  checked class="chkdhide"  type="checkbox" value="Mobile"  name="cfmobile" ><a href="#" class="small" data-value="option " tabIndex="-1">Mobile</a></li>';
                    option += '<li><input  checked class="chkdhide"  type="checkbox" value="Email"  name="cfemail" ><a href="#" class="small" data-value="option " tabIndex="-1">Email</a></li>';
                    $.each(obj, function (i, val) {
                        q1 = q1 + 1;
                        columnvalue = columnvalue + 1;
                        sort = sort + 1;
                        if (columnvalue > defaultcolumncount) {
                            checkvalue = "";
                            headerhsvalue = "display:none";
                        }
                        $header += '<th  style="' + headerhsvalue + '" class="cfClass' + q1 + '"><div class="thbg">' + val.column_name + '</div></th>';
                        option += '<li><input  ' + checkvalue + ' class="chkdhide"  type="checkbox" value="' + val.column_name + '"  name="cfClass' + q1 + '" ><a href="#" class="small" data-value="option' + val.column_name + '" tabIndex="-1">' + val.column_name + '</a></li>';
                    });
                    $('#cfheadrow').append($header);
                    $("#cfod").append(option);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            loadCfieldList(cfpageindex);
        });
    }

    /*Load custom field list*/
    function loadCfieldList(cfpageindex) {
        $("#cfbindcasedata").empty();
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        var vdate = $("#cfversion").val();
        formdata.append("pagenum", EncodeText(cfpageindex));
        formdata.append("pagesize", EncodeText(cfpagesize));
        formdata.append("VersionDate", EncodeText(vdate));
        formdata.append("ModuleType", EncodeText(type));
        var ajaxTime = new Date().getTime();
        openload();
        var ld122 = $.ajax({
            async: true,
            url: '/api/CallApi/LoadCustomFieledHistroy',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                $("#cfcasetfooter").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    if (response.Data == "[]") {
                        alert("No Result found");
                        $("#footerhead,#ExporttoExcelCFHistory").hide();
                        return false;
                    }
                    else {
                        $("#footerhead,#ExporttoExcelCFHistory").show();
                    }
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                }
                if (response.Data.length > 2) {
                }
                else {
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                var headerhsvaluechild = "display:table-cell";
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (val.totRow > 0) {
                            pnext = parseInt(pnext) + 1;
                            if (pnext == 0) pnext = 1;
                            pprev = parseInt(pageno) - 1;
                            if (pprev == 0) pprev = 1;
                            totpage = parseInt(totdata) / parseInt(pagesize);
                            if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                totpage = parseInt(totpage) + 1;
                            }
                            $("#cfpagnumvalue").attr("max", totpage);
                        }
                        var tfot = '';
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + val.totRow + '</span>  <span id="cfpsotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="cfppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="cfpgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                        if (val.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="cfppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            tfot += '<li><span><a id="cfppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="cfppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#cfcasetfooter").append(tfot);
                    }
                    qty = qty + 1;
                    it = it + 1;
                    var $row = $('<tr>');
                    $row.append($('<td class="cfcontactype" />').html("<span>" + val.Contacttype));
                    $row.append($('<td class="cffname" />').html("<span>" + val.FirstName));
                    $row.append($('<td class="cflname" />').html("<span>" + val.LastName));
                    $row.append($('<td class="cfmobile" />').html("<span>" + val.Mobile));
                    $row.append($('<td class="cfemail" />').html("<span>" + val.Email));
                    var countcf = countcustomfieldCF;
                    for (var str = 1; str <= countcf; str++) {
                        if (str > defaultcolumncount) {
                            headerhsvaluechild = "display:none";
                        }
                        else {
                            headerhsvaluechild = "display:table-cell";
                        }
                        if (str == 1) {
                            if (val.col1 == "") {
                                $row.append($('<td class="cfclass3" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col1 == null) {
                                $row.append($('<td class="cfclass3"  style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass3"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col1)));
                            }
                        }
                        if (str == 2) {
                            if (val.col2 == "") {
                                $row.append($('<td class="cfclass4" style="' + headerhsvaluechild + '"  />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col2 == null) {
                                $row.append($('<td class="cfclass4" style="' + headerhsvaluechild + '"  />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass4" style="' + headerhsvaluechild + '"   />').html("<span>" + checkdatetimecustom(val.col2)));
                            }
                        }
                        if (str == 3) {
                            if (val.col3 == "") {
                                $row.append($('<td class="cfclass5" style="' + headerhsvaluechild + '"  />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col3 == null) {
                                $row.append($('<td class="cfclass5" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass5"  style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col3)));
                            }
                        }
                        if (str == 4) {
                            if (val.col4 == "") {
                                $row.append($('<td class="cfclass6" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col4 == null) {
                                $row.append($('<td class="cfclass6" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass6"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col4)));
                            }
                        }
                        if (str == 5) {
                            if (val.col5 == "") {
                                $row.append($('<td class="cfclass7" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col5 == null) {
                                $row.append($('<td class="cfclass7" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass7"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col5)));
                            }
                        }
                        if (str == 6) {
                            if (val.col6 == "") {
                                $row.append($('<td class="cfclass8" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col6 == null) {
                                $row.append($('<td class="cfclass8" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass8" style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col6)));
                            }
                        }
                        if (str == 7) {
                            if (val.col7 == "") {
                                $row.append($('<td class="cfclass9" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col7 == null) {
                                $row.append($('<td class="cfclass9" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass9"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col7)));
                            }
                        }
                        if (str == 8) {
                            if (val.col8 == "") {
                                $row.append($('<td class="cfclass10" style="' + headerhsvaluechild + '"/>').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col8 == null) {
                                $row.append($('<td class="cfclass10" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass10"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col8)));
                            }
                        }
                        if (str == 9) {
                            if (val.col9 == "") {
                                $row.append($('<td class="cfclass11" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col9 == null) {
                                $row.append($('<td class="cfclass11" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass11"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col9)));
                            }
                        }
                        if (str == 10) {
                            if (val.col10 == "") {
                                $row.append($('<td class="cfclass12" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col10 == null) {
                                $row.append($('<td class="cfclass12"  style="' + headerhsvaluechild + '"/>').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass12" style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col10)));
                            }
                        }
                        if (str == 11) {
                            if (val.col11 == "") {
                                $row.append($('<td class="cfclass13" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col11 == null) {
                                $row.append($('<td class="cfclass13" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass13"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col11)));
                            }
                        }
                        if (str == 12) {
                            if (val.col12 == "") {
                                $row.append($('<td class="cfclass14" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col12 == null) {
                                $row.append($('<td class="cfclass14" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass14"  style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col12)));
                            }
                        }
                        if (str == 13) {
                            if (val.col13 == "") {
                                $row.append($('<td class="cfclass15" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col13 == null) {
                                $row.append($('<td class="cfclass15" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass15" style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col13)));
                            }
                        }
                        if (str == 14) {
                            if (val.col14 == "") {
                                $row.append($('<td class="cfclass16"  style="' + headerhsvaluechild + '"/>').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col14 == null) {
                                $row.append($('<td class="cfclass16" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass16" style="' + headerhsvaluechild + '"  />').html("<span>" + checkdatetimecustom(val.col14)));
                            }
                        }
                        if (str == 15) {
                            if (val.col15 == "") {
                                $row.append($('<td class="cfclass17" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else if (val.col15 == null) {
                                $row.append($('<td class="cfclass17" style="' + headerhsvaluechild + '" />').html("<span>&nbsp;</span>"));
                            }
                            else {
                                $row.append($('<td class="cfclass17" style="' + headerhsvaluechild + '" />').html("<span>" + checkdatetimecustom(val.col15)));
                            }
                        }
                    }
                    $("#cfbindcasedata").append($row);
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld122).then(function (data, textStatus, jqXHR) {
            $("#CFHistoryData").removeAttr("disabled");
            closeload();
            return false;
        });
    }
    //end CField history
    $(document).on("click", "#companydetails", function () {
        var token = $(this).attr("data-id");
        var name = $(this).attr("name");
        $('#companyname').text(name);
        $("#cltokencompany").val(token);
        $("#companys").val(name);
        $("#frmcompanydetails")[0].reset();
        // cloadtabledata();
        var $ctable = '';
        var $cheader = '';
        var $chead1 = '';
        var cdt = '';
        var cq1 = 2;
        var csort = 10;
        $ctable = $('<table id="cexample"   class="" style="overflow-x:auto;" /><tr><th>').addClass('table');
        $cheader = $('<thead>').html('');
        $chead1 += '<th ><div class="thbg"><input type="checkbox" id="select_all"/></div></th>'
        $chead1 += '<th  onclick="sortTable(3)" class="cityc"><div class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th class="cufnamec" onclick = "sortTable(4)" width = "20%" > <div class="thbg">First Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th class="clnamec" onclick = "sortTable(5)" width = "20%" ><div class="thbg"> Last Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th  class="mobnoc"><div class="thbg"><span style="padding-right: 10px !important;">Mobile</span></div></th>';
        $chead1 += '<th  class="ccemailc"><div class="thbg"><span style="padding-right: 10px !important;">Email</span></div></th>';
        $chead1 += '<th onclick="sortTable(8)" class="useridc"><div class="thbg"><span style="padding-right: 20px !important;">UserId</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th onclick="sortTable(9)" class="cstatusc"><div class="thbg"><span style="padding-right: 10px !important;">Status</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(10)" class="createdbyc"><div class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(11)" ><div class="thbg">Action</div></th>';
        $chead1 += '<th onclick ="sortTable(12)" class="ContactTypec" width = "12%"  > <div class="thbg"><span style="padding-right: 10px !important;">Contact Type</span> <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th  onclick="sortTable(13)" class="landlinec"><div class="thbg"><span style="padding-right: 20px !important;">Landline</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th  onclick="sortTable(14)" class="cadd1c"><div class="thbg"><span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th   onclick="sortTable(15)" class="designationc"><div class="thbg"><span style="padding-right: 10px !important;">Designation</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th  onclick="sortTable(16)" class="countryc"><div class="thbg"><span style="padding-right: 10px !important;">Country</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th onclick="sortTable(17)" class="statec"><div class="thbg"><span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(18)" class="pinc"><div class="thbg"><span style="padding-right: 10px !important;">PIN</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  class="GSTNoc"><div class="thbg"><span style="padding-right: 10px !important;">GSTNo</span></div></th >';
        $chead1 += '<th  class="PANNoc"><div class="thbg"><span style="padding-right: 10px !important;">PANNo</span></div></th >';
        $chead1 += '<th  class="AadharNoc"><div class="thbg"><span style="padding-right: 10px !important;">AadharNo</span></div></th >';
        $chead1 += '<th  class="CompanyStructurec"><div class="thbg"><span style="padding-right: 10px !important;">CompanyStructure</span></div></th >';
        $chead1 += '<th   class="clientdocsc"><div class="thbg"><span style="padding-right: 10px !important;">Documents</span></div></th >';
        $cheader.append($chead1);
        $cheader.append('</thead>');
        $ctable.append($cheader);
        $ctable.append('<tbody style="clear:both" id="cloadactivitydatasforcomapny">');
        $('#cupdatePanelforcompany').html($ctable);
        cloadcontactlistforcompany(cpageindexcom, token);
        $('#myModalcompanydetails').modal({ show: true });
    });
    $("#chngclpwd").click(function () {
        var password = $("#clnpassword").val();
        var confirmPassword = $("#clcpassword").val();
        var username = $("#clusername").val();
        if (username == "") {
            alert("Please enter User Id");
            document.getElementById("clusername").focus();
            return false;
        }
        if (username.length < 5) {
            $('#useriderror').text('User id should be more than or equal to five characters.');
            document.getElementById("clusername").focus();
            return false;
        }
        if (specialcharecter() == "1") {
            return false;
        }
        if (password == "") {
            alert("Please set the password for the User Id.");
            document.getElementById("clnpassword").focus();
            return false;
        }
        if (password.length < 8) {
            alert("Password must contain at least eight characters.");
            document.getElementById("clnpassword").focus();
            return false;
        }
        if ($("#clnpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            if (reg.test($("#clnpassword").val()) == false) {
                alert("Password must contain at least eight characters, with at least one character in uppercase, one in lowercase and one special character (any one from @#$*!^_).");
                document.getElementById("clnpassword").focus();
                return false;
            }
        }
        if (specialcharecterpass($("#clnpassword")) == "1") {
            return false;
        }
        if (confirmPassword == "") {
            alert("Please confirm your password that you want to set.");
            document.getElementById("clcpassword").focus();
            return false;
        }
        if (confirmPassword.length < 8) {
            alert("Confirm Password must contain at least eight characters.");
            document.getElementById("clcpassword").focus();
            return false;
        }
        if ($("#clcpassword").val() != "") {
            var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            if (reg.test($("#clcpassword").val()) == false) {
                alert("Confirm Password must contain at least eight characters, with at least one character in uppercase, one in lowercase and one special character (any one from @#$*!^_).");
                document.getElementById("clcpassword").focus();
                return false;
            }
        }
        if (specialcharectercpass($("#clcpassword")) == "1") {
            return false;
        }
        if (password != confirmPassword) {
            alert("Password did not match!");
        }
        else {
            var formData = new FormData();
            formData.append("userid", EncodeText(username));
            formData.append("cpassword", EncodeText(confirmPassword));
            formData.append("token", EncodeText($("#cltoken").val()));
            openload();
            $.ajax(
                {
                    type: "POST",
                    url: "/api/CallApi/CreateClientLogin", // Controller/View
                    dataType: 'json',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (String(data.Data) == "ExistUserID") {
                            alert('User id already exists. Please try different user id');
                            closeload();
                            return false;
                        }
                        else if (String(data.Data) == "user exceed limit") {
                            alert("You have reached your License limit. Please upgrade your subscription Plan.")
                            closeload();
                        }
                        else {
                            $("#frmpass")[0].reset();
                            alert("Client credentials have been created successfully.");
                            document.getElementById("closemodel").click();
                            cloadcontactlist(cpageindex);
                            closeload();
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
    });
    $(document).on("click", "#transferpage", function () {
        var type = $(this).attr("data-type");
        var token = $(this).attr("data-id");
        var urls = "/" + fcode + "/Firm/EditContacts";
        url_redirect({
            url: urls,
            method: "post",
            data: { "token": token, "type": type }
        });
    });
    $(document).on("click", "#transferpagetocase", function () {
        var token = $(this).attr("data-id");
        //alert(token);
        var urls = "/" + fcode + "/Firm/ClientCaseList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token }
        });
    });
    var exportfilter = false;

    $("#iscomorindividual").change(function () {
        $("#searchdatas").click();
    });
    $("#Clistctype").change(function () {
        $("#searchdata").val("");
        var lists = $("#Clistctype option:selected").text();
        if (lists == "") {
            $("#Propectdiv").css("display", "none");
            $("#clientdiv").css("display", "none");
            $("#otherdiv").css("display", "none");
            $("#allcontactsdiv").css("display", "none");
        }
        else if (lists == "Prospect") {
            $("#Propectdiv").css("display", "block");
            $("#clientdiv").css("display", "none");
            $("#otherdiv").css("display", "none");
            $("#allcontactsdiv").css("display", "none");
            ploadtabledata();
        }
        else if (lists == "Client") {
            $("#Propectdiv").css("display", "none");
            $("#clientdiv").css("display", "block");
            $("#otherdiv").css("display", "none");
            $("#allcontactsdiv").css("display", "none");
            cloadtabledata();
        }
        else if (lists == "All") {
            $("#Propectdiv").css("display", "none");
            $("#clientdiv").css("display", "none");
            $("#otherdiv").css("display", "none");
            $("#allcontactsdiv").css("display", "block");
            allloadtabledata();
        }
        else {
            $("#Propectdiv").css("display", "none");
            $("#clientdiv").css("display", "none");
            $("#otherdiv").css("display", "block");
            $("#allcontactsdiv").css("display", "none");
            oloadtabledata();
        }
    });
    var chksflag = true;
    $("#clearnewseach").click(function () {
        $("#searchdata").val("");
        $("#clearnewseach").css("display", "none");
        if ($("#Clistctype option:selected").text() == "Client") {
            exportfilter = true;
            cloadtabledata(1);
        }
        else if ($("#Clistctype option:selected").text() == "Prospect") {
            ploadtabledata(1);
        }
        else if ($("#Clistctype option:selected").text() == "All") {
            alladcontactlist(1)
        }
        else {
            oloadtabledata(1);
        }
        chksflag = true;
    })
    $("#searchdatas").click(function () {
        $("#clearnewseach").css("display", "unset");
        if ($("#Clistctype option:selected").text() == "Client") {
            exportfilter = true;
            cloadtabledata(1);
        }
        else if ($("#Clistctype option:selected").text() == "Prospect") {
            ploadtabledata(1);
        }
        else if ($("#Clistctype option:selected").text() == "All") {
            alladcontactlist(1)
        }
        else {
            oloadtabledata(1);
        }
        chksflag = true;
    });
    $(document).on('keyup', '#searchdata', function () {
        var txtlength = $(this).val().length;
        if (txtlength > 0) {
        }
        else {
            if (chksflag == true) {
                if ($("#Clistctype option:selected").text() == "Client") {
                    cloadtabledata(1);
                    cexportfilter = false;
                }
                else if ($("#Clistctype option:selected").text() == "Prospect") {
                    ploadtabledata(1);
                }
                else {
                    oloadtabledata(1);
                }
                chksflag = false;
            }
        }
    });
    function openload() {
        $('#myOverlay').css("display", "block");
    }
    function closeload() {
        $('#myOverlay').css("display", "none");
    }
    ////////////////Start Propect///////////// 
    $(document).on('click', '#pgetdatabypagenum', function () {
        ppageindex = $("#ppagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#psotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loadcontactlist(ppageindex);
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
    var chksflag = true;
    $(document).on('click', '#ppaginate', function () {
        ppageindex = $(this).attr("index");
        loadcontactlist(ppageindex);
    });
    /*Load custom field*/
    function ploadtabledata() {
        var $table = '';
        var $header = '';
        var $head1 = '';
        var dt = '';
        var q1 = 2;
        var sort = 18;
        $table = $('<table id="pexample"  class="" style="overflow-x:auto;" /><tr><th>').addClass('table ');
        var rt1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    $header = $('<thead>').html('');
                    $head1 += '<th><div class="thbg"><input type="checkbox" id="select_all"/></div></th>'
                    $head1 += '<th  onclick="psortTable(1)" class="pcompanyname iscompanyindicidualclass"><div class="thbg"><span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort "></span></div></th >';
                    $head1 += '<th  onclick="psortTable(2)" class="pcity"><div class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort "></span></div></th >';
                    $head1 += '<th class="pfname" onclick = "psortTable(3)" width = "20%" > <div class="thbg">First Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $head1 += '<th class="plname" onclick = "psortTable(4)" width = "20%" > <div class="thbg">Last Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $head1 += '<th  class="pmobno"><div class="thbg"><span style="padding-right: 10px !important;">Mobile</span></div></th>';
                    $head1 += '<th  class="pcemail"><div class="thbg"><span style="padding-right: 10px !important;">Email</span></div></th>';
                    $head1 += '<th onclick="psortTable(7)" class="pcreatedby"><div class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $head1 += '<th onclick="psortTable(8)" class="pContactType"><div class="thbg"><span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $head1 += '<th onclick="psortTable(9)" class="pPtype"><div class="thbg"><span style="padding-right: 20px !important;">Propspect Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $head1 += '<th onclick="psortTable(10)" class="psource"><div class="thbg"><span style="padding-right: 20px !important;">Source/Reference</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';  //$head1 += '<th  onclick="psortTable(11)" class="pcadd1"><span style="padding-right: 10px !important;">Address</span><span class="fa fa-fw fa-sort pull-right"></span></th>';
                    $head1 += '<th  class="CompanyStructure"><div class="thbg"><span style="padding-right: 10px !important;">CompanyStructure</span></div></th >';
                    $header.append($head1);
                    $header.append('<th width="5%;" ><div class="thbg"><span style="padding-right: 10px !important;" >Action&nbsp;&nbsp;&nbsp;</span></div></th>');
                    var option = "";
                    $header.append('</thead>');
                    $table.append($header);
                    $table.append('<tbody style="clear:both" id="loadactivitydatas">');
                    $('#pupdatePanel').html($table);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(rt1).then(function (data, textStatus, jqXHR) {
            loadcontactlist(pageindex);
        });
    }
    flaghide = true;
    function loadcontactlist(pageindex) {
        $("#loadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(pageindex));
        formdata.append("pagesize", EncodeText(pagesize));
        formdata.append("search", EncodeText($('#searchdata').val().replace(/\"/g, '').replace(/\'/g, '')));
        formdata.append("type", EncodeText($('#Clistctype').val()));
        formdata.append("iscomorindv", EncodeText($("#iscomorindividual").val()));
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/CallApi/Sp_NewStandardContactsData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#ptfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var length = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#pdatastatus").html("");
                    //closeload();
                }
                else {
                    //alert(response.Data.length);
                    //alert("No result found");
                    $("#pdatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        firstvalue = val.rownum;
                    }
                    if (i === (length - 1)) {
                        var pnext = pageindex;
                        var pprev = pageindex;
                        var pageno = pageindex;
                        var totdata = val.totRow;
                        var totpage = 0;
                        if (val.totRow > 0) {
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
                        tfot += '<ul>'
                        tfot += '<li>results <span>' + val.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                        tfot += '<li><span>|</span></li>'
                        tfot += '<li ><input type="number" id="ppagnumvalue" min="1" class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="pgetdatabypagenum" style="margin-left:10px;">Go</button> </li>'
                        if (val.totRow <= length) {
                        }
                        else if (pageno == 1) {
                        }
                        else if (pageno == totpage) {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'                            //tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" > </a></span>  ' + firstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (pageno < totpage) {
                            tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        tfot += '</ul>'
                        $("#ptfooter").append(tfot);
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    if (val.fname != "" && val.fname != null) {
                        whtsdata = whtsdata.concat("Name: " + val.fname);
                    }
                    if (val.mname != "" && val.mname != null) {
                        whtsdata = whtsdata.concat(" " + val.mname);
                    }
                    if (val.lname != "" && val.lname != null) {
                        whtsdata = whtsdata.concat(" " + val.lname);
                    }
                    if (val.mobno != "" && val.mobno != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.mobno);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.cadd1 != "" && val.cadd1 != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.cadd1);
                    }
                    $row.append($('<td class="s" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.cid + "'/><a id='socialnetwork' style='display:none'  title='share to whatsapp'  href='whatsapp://send?text=" + whtsdata + "' data-action='share/whatsapp/share' class='fa fa-whatsapp socialnetwork socialwhats'></a>"));
                    $row.append($('<td class="pcompanyname iscompanyindicidualclass" />').html("<span>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcity" />').html("<span>" + (val.City != null ? val.City : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pfname" />').html("<span>" + (val.fname != null ? val.fname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="plname" />').html("<span>" + (val.lname != null ? val.lname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pmobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pcreatedby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pContactType" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="pPtype" />').html("<span>" + (val.PropectType != null ? val.PropectType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="psource" />').html("<span>" + (val.SourceRef != null ? val.SourceRef : '<span >&nbsp;</span>')));
                    $row.append($('<td class="CompanyStructure" />').html("<span>" + (val.CompanyStructure != null ? val.CompanyStructure : '<span style="visibility: hidden;">&nbsp;</span>')));
                    var proaction = '';
                    var proaction = '<td>';
                    if (val.oedit == 1 || roleids == 1) {
                        proaction += "<span class='glyphicon glyphicon-pencil' id='transferpage' style='color:#069;cursor:postart printer;margin-right:5px;'title='Edit propsect' data-type=" + val.ProfileType + " data-id=" + val.cid + " sno=" + qty + "></span>|&nbsp;";
                    }
                    if (val.odelete == 1 || roleids == 1) {
                        proaction += "<span class='glyphicon glyphicon-trash' id='removeprospect' style='color: red; cursor: pointer; ' title='Remove propsect' id-val=" + val.cid + "></span>";
                    }
                    $row.append($('<td />').html(proaction));
                    try {
                        var countcf = countcustomfoeld;
                    }
                    catch
                    {
                    }
                    $("#loadactivitydatas").append($row);
                    //$("#loadactivitydata").html($row);
                });
                hideshowcompanycolumnbyfilter();
                // hideEmptyCols($("#example"));
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    // ploadmenu();
    function ploadmenu() {
        var qp = 2;
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                // 'fid': type
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                $.each(obj, function (i, a) {
                    qp = qp + 1;
                    var option = '<li><input  class="chkdhide"  type="checkbox"  name="class' + qp + '" ><a href="#" class="small" data-value="option' + qp + '" tabIndex="-1">' + a.FieldName + '</a></li>';
                    $("#bd").append(option);
                }); //End of foreach Loop
                //console.log($("#bd").html());
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
    ////////////////END Propect/////////////
    ////////////////Start Client/////////////
    var fcode = localStorage.getItem("FirmCode");
    var cexportfilter = false;
    function checkEmail(email) {
        var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regExp.test(email);
    }
    try {
        $("#sharedocs").click(function () {
            var formdata = new FormData();
            var emailto = $("#shareemail").val();
            if (emailto == "") {
                alert("Please enter the E-mail Id.");
                return false;
            }
            else {
                if (emailto != "") {
                    var emailArray = emailto.split(",");
                    for (i = 0; i <= (emailArray.length - 1); i++) {
                        if (checkEmail(emailArray[i])) {
                            //  alert("true");
                            vEmails = "true";
                        } else {
                            vEmails = "false";
                            new PNotify({
                                title: 'Warning!',
                                text: ' Invalid email format!',
                                type: 'error',
                                delay: 3000
                            });
                        }
                    }
                }
            }
            if (vEmails == "" || vEmails == "true") {
                formdata.append("email", EncodeText(emailto));
                openload();
                $.ajax({
                    async: true,
                    url: '/firm/SendContactsClientList',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (response) {
                        new PNotify({
                            title: 'Success!',
                            text: ' Data has been sent Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#shareemail").val("");
                        closeload();
                        document.getElementById("closesharebox").click();
                    },
                    error: function () {
                        closeload();
                    }
                });
            }
        });
    }
    catch (er) {
        alert(er.message);
        closeload();
    }
    var selectedID = new Array();
    $("#enable").click(function () {
        selectedID = [];
        enableclient();
        function enableclient() {
            var result = confirm("Are you sure to Enable Account?");
            if (result) {
                $('#cloadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/EnableClient',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                if (response.Data == "invalid user license") {
                                    alert("Invalid user login credentials. Please check the same or contact your administrator.")
                                    closeload();
                                }
                                else if (response.Data == "user exceed limit") {
                                    alert("You have reached the maximum limit of the client creation based on your plan. Please upgrade your plan for a seamless experience.")
                                    closeload();
                                }
                                else {
                                    var datas = JSON.stringify(response);
                                    new PNotify({
                                        title: 'Success!',
                                        text: '  ' + clientlable + '  Account Activated Successfully',
                                        type: 'success',
                                        delay: 3000
                                    });
                                    $('#select_all').prop('checked', false);
                                    cloadcontactlist(cpageindex);
                                    closeload();
                                }
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            alert('Error!');
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: 'You have not selected any rows to activate account.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    $(document).on("click", "#select_all", function () {
        $(".checkbox").prop('checked', $(this).prop('checked'));
    });
    var selectedID = new Array();
    $(document).on("click", "#removeprospect", function () {
        selectedID = [];
        var cltypes = $("#Clistctype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        var ids = $(this).attr("id-val");
        deletecontactsingle();
        /*Delete single contact*/
        function deletecontactsingle() {
            var result = confirm("Are you sure to delete contacts ?");
            if (result) {
                selectedID.push(ids);
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $("#searchdatas").click();
                                closeload();
                            }
                            else {
                                closeload();
                                //alert("not found");
                            }
                        },
                        error: function () {
                            closeload();
                            //  alert('Error!');
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
                    closeload();
                }
            }
        }
    });

    /*Remove others*/
    $(document).on("click", "#removeothers", function () {
        selectedID = [];
        var cltypes = $("#Clistctype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        var ids = $(this).attr("id-val");
        odeletecontactsingle();
        //}
        function odeletecontactsingle() {
            var result = confirm("Are you sure to delete Contacts?");
            if (result) {
                selectedID.push(ids);
                if (JSON.stringify(selectedID) != "[]") {
                    //  alert("hi");
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                oloadcontactlist(opageindex);
                                alladcontactlist(opageindex);
                                closeload();
                            }
                            else {
                                closeload();
                                //alert("not found");
                            }
                        },
                        error: function () {
                            closeload();
                            //  alert('Error!');
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
                    closeload();
                }
            }
        }
    });
    var selectedID = new Array();
    $("#premove").click(function () {
        selectedID = [];
        var cltypes = $("#Clistctype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        deletecontact();

        /*Delete contact*/
        function deletecontact() {
            var result = confirm("Are you sure to delete Contact?");
            if (result) {
                $('#loadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                loadcontactlist(pageindex);
                                closeload();
                            }
                            else {
                                closeload();
                                //alert("not found");
                            }
                        },
                        error: function () {
                            closeload();
                            //  alert('Error!');
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
                    closeload();
                }
            }
        }
    });
    $("#oremove").click(function () {
        selectedID = [];
        var cltypes = $("#Clistctype").val();
        if (cltypes == "") {
            alert("Please select the contact type.");
            return false;
        }
        odeletecontact();
        /*Delete contact*/
        function odeletecontact() {
            var result = confirm("Are you sure to delete Contact?");
            if (result) {
                $('#oloadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/RemoveContacts',
                        data: JSON.stringify(selectedID),
                        headers: {
                            'ctype': cltypes
                        },
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: ' Contacts Removed Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                oloadcontactlist(opageindex);
                                closeload();
                            }
                            else {
                                closeload();
                            }
                        },
                        error: function () {
                            closeload();
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
                    closeload();
                }
            }
        }
    });
    ///delete client contact
    $(document).on("click", "#removeclient", function () {
        var ids = $(this).attr("id-val");
        var comapnyIds = $(this).attr("idss");
        var formData = new FormData();
        formData.append("cids", EncodeText(ids));
        formData.append("comapnyids", EncodeText(comapnyIds));
        var result = confirm("Are you sure to delete Contacts?");
        if (result) {
            openload();
            $.ajax({
                async: true,
                url: '/api/CallApi/Removecompanycontact',
                data: formData,
                type: 'POST',
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (response) {
                    if (response.Status == true) {
                        var datas = JSON.stringify(response);
                        new PNotify({
                            title: 'Success!',
                            text: ' Contacts Removed Successfully',
                            type: 'success',
                            delay: 3000
                        });
                        oloadcontactlist(opageindex);
                        alladcontactlist(opageindex);
                        closeload();
                    }
                    else {
                        closeload();
                    }
                },
                error: function () {
                    closeload();
                    //  alert('Error!');
                }
            });
        }
    });
    var selectedIDSync = new Array();
    $("#syncrqst").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#cloadactivitydatas input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", EncodeText("client"));
                openload();
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
                            cloadcontactlist(cpageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
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
                closeload();
            }
        }
    });
    $("#syncrqstprospect").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#loadactivitydatas input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", EncodeText("contact"));
                openload();
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
                            loadcontactlist(pageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
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
                closeload();
            }
        }
    });
    $("#syncrqstothers").click(function () {
        selectedIDSync = [];
        var result = confirm("Are you sure to save data sync request?");
        if (result) {
            $('#oloadactivitydatas input:checkbox.checkbox').each(function () {
                if ($(this).prop('checked')) {
                    selectedIDSync.push($(this).val());
                }
            });
            if (JSON.stringify(selectedIDSync) != "[]") {
                var formdata = new FormData();
                formdata.append("token", selectedIDSync);
                formdata.append("tablekey", EncodeText("contact"));
                openload();
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
                            oloadcontactlist(opageindex);
                            closeload();
                        }
                        else {
                            closeload();
                        }
                    },
                    error: function () {
                        closeload();
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
                closeload();
            }
        }
    });
    var selectedID = new Array();
    $("#disable").click(function () {
        selectedID = [];
        disableclient();
        function disableclient() {
            var result = confirm("Are you sure to Disable Account?");
            if (result) {
                $('#cloadactivitydatas input:checkbox.checkbox').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                        // alert(JSON.stringify(selectedID));
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    //  alert("hi");
                    openload();
                    $.ajax({
                        async: true,
                        url: '/api/CallApi/DisableClient',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            if (response.Status == true) {
                                var datas = JSON.stringify(response);
                                new PNotify({
                                    title: 'Success!',
                                    text: '  ' + clientlable + '  Account De-activated  Successfully',
                                    type: 'success',
                                    delay: 3000
                                });
                                $('#select_all').prop('checked', false);
                                cloadcontactlist(cpageindex);
                                closeload();
                            }
                            else {
                                //alert("not found");
                                closeload();
                            }
                        },
                        error: function () {
                            //alert('Error!');
                            closeload();
                        }
                    });
                }
                else {
                    new PNotify({
                        title: 'Warning',
                        text: 'You have not selected any rows to de-activate account.',
                        type: 'error',
                        delay: 3000
                    });
                    closeload();
                }
            }
        }
    });
    $(document).on('click', '#cgetdatabypagenum', function () {
        cpageindex = $("#cpagnumvalue").val();
        if (cpageindex != "undefined") {
            if (Math.sign(cpageindex) == 1) {
                var cpageindesx = $("#csotopage").text();
                if (cpageindex <= parseInt(cpageindesx)) {
                    openload();
                    cloadcontactlist(cpageindex);
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
    $(document).on('click', '#cgetdatabypagenumforcompany', function () {
        cpageindex = $("#cpagnumvalue").val();
        if (cpageindex != "undefined") {
            if (Math.sign(cpageindex) == 1) {
                var cpageindesx = $("#csotopage").text();
                if (cpageindex <= parseInt(cpageindesx)) {
                    openload();
                    var token = $("#cltokencompany").val();
                    cloadcontactlistforcompany(cpageindex, token);
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
    var chksflag = true;
    $(document).on('click', '#cpaginate', function () {
        cpageindex = $(this).attr("index");
        cloadcontactlist(cpageindex);
    });
    $(document).on('click', '#cpaginateforcompany', function () {
        cpageindex = $(this).attr("index");
        var token = $("#cltokencompany").val();
        cloadcontactlistforcompany(cpageindex, token);
    });
    function cloadtabledata() {
        var $ctable = '';
        var $cheader = '';
        var $chead1 = '';
        var cdt = '';
        var cq1 = 2;
        var csort = 10;
        $ctable = $('<table id="cexample"   class="" style="overflow-x:auto;" /><tr><th>').addClass('table');
        $cheader = $('<thead>').html('');
        $chead1 += '<th ><div class="thbg"><input type="checkbox" id="select_all"/></div></th>'
        $chead1 += '<th class="IsCompany" onclick = "sortTable(1)" width = "20%" ><div class="thbg"> Client Type <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th  onclick="sortTable(2)" class="companyname iscompanyindicidualclass"><div class="thbg"><span style="padding-right: 10px !important;">CompanyName</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(3)" class="city" width = "10%" ><div class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th class="cufname" onclick = "sortTable(4)" width = "20%" > <div class="thbg">First Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th class="clname" onclick = "sortTable(5)" width = "20%" ><div class="thbg"> Last Name <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
        $chead1 += '<th  class="mobno"><div class="thbg"><span style="padding-right: 10px !important;">Mobile</span></div></th>';
        $chead1 += '<th  class="ccemail"><div class="thbg"><span style="padding-right: 10px !important;">Email</span></div></th>';
        $chead1 += '<th onclick="sortTable(8)" class="userid" width = "10%"><div class="thbg"><span style="padding-right: 20px !important;">UserId</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
        $chead1 += '<th onclick="sortTable(9)" class="cstatus"><div class="thbg"><span style="padding-right: 10px !important;">Status</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(10)" class="createdby"><div class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
        $chead1 += '<th  onclick="sortTable(11)" ><div class="thbg">Action</div></th>';
        $chead1 += '<th onclick ="sortTable(12)" class="ContactType" width = "12%"  > <div class="thbg"><span style="padding-right: 10px !important;">Contact Type</span> <span class="fa fa-fw fa-sort pull-right"></span></div></th>';        //$chead1 += '<th  onclick="sortTable(13)" class="landline"><span style="padding-right: 20px !important;">Landline</span><span class="fa fa-fw fa-sort pull-right"></span></th>';
        $chead1 += '<th  class="CompanyStructure"><div class="thbg"><span style="padding-right: 10px !important;">CompanyStructure</span></div></th >';
        $cheader.append($chead1);
        $cheader.append('</thead>');
        $ctable.append($cheader);
        $ctable.append('<tbody style="clear:both" id="cloadactivitydatas">');
        $('#cupdatePanel').html($ctable);
        cloadcontactlist(cpageindex);
    }
    var rer = 1;
    cflaghide = true;
    /*Load contact list details*/
    function cloadcontactlist(cpageindex) {
        $("#cloadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        cltype = $('#Clistctype').val();
        if (cltype == "") {
            var cltype = "Client";
        }
        if (cltype != "Client") {
            cltype = "Client";
        }
        formdata.append("pagenum", EncodeText(cpageindex));
        formdata.append("pagesize", EncodeText(cpagesize));
        formdata.append("search", EncodeText($('#searchdata').val().replace(/\"/g, '').replace(/\'/g, '')));
        formdata.append("type", EncodeText(cltype));
        formdata.append("iscomorindv", EncodeText($("#iscomorindividual").val()));
        var ajaxTime = new Date().getTime();
        openload();
        var cld12 = $.ajax({
            async: true,
            url: '/api/CallApi/Sp_NewStandardContactsData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#ctfooter").html("");
                $("#ctokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var clength = obj.length;
                }
                else {
                    //alert("not found");
                }

                if (response.Data.length > 2) {
                    $("#cdatastatus").html("");
                    closeload();
                }
                else {
                    $("#cdatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                $("#cloadactivitydatas tr").remove();
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        cfirstvalue = val.rownum;
                    }
                    if (i === (clength - 1)) {
                        var cpnext = cpageindex;
                        var cpprev = cpageindex;
                        var cpageno = cpageindex;
                        var ctotdata = val.totRow;
                        var ctotpage = 0;
                        if (val.totRow > 0) {
                            cpnext = parseInt(cpnext) + 1;
                            if (cpnext == 0) cpnext = 1;
                            cpprev = parseInt(cpageno) - 1;
                            if (cpprev == 0) cpprev = 1;
                            ctotpage = parseInt(ctotdata) / parseInt(cpagesize);
                            if (parseInt(ctotdata) % parseInt(cpagesize) != 0) {
                                ctotpage = parseInt(ctotpage) + 1;
                            }
                            $("#cpagnumvalue").attr("max", ctotpage);
                        }
                        var ctfot = '';
                        ctfot += '<ul>'
                        ctfot += '<li>results <span>' + val.totRow + '</span>  <span id="csotopage" style="display:none">' + ctotpage + '</span></li>'
                        ctfot += '<li><span>|</span></li>'
                        ctfot += '<li>pages ' + cpageindex + '/ ' + parseInt(ctotpage) + '</li>'
                        ctfot += '<li><span>|</span></li>'
                        ctfot += '<li ><input type="number" id="cpagnumvalue" min="1" class="footerInput"><a class="gobtn"  style="cursor:pointer" type="button" id="cgetdatabypagenum" >Go</a> </li>'
                        if (val.totRow <= clength) {
                        }
                        else if (cpageno == 1) {
                        }
                        else if (cpageno == ctotpage) {
                            ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'                            //tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            ctfot += '<li><span><a id="cpaginate"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (cpageno < ctotpage) {
                            ctfot += '<a  id="cpaginate" title="Next Page" href="javascript:void()" index="' + cpnext + '" ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        ctfot += '</ul>'
                        $("#ctfooter").append(ctfot);
                    }
                    qty = qty + 1;
                    var btitle = "";
                    var bclass = "";
                    var bdata = "";
                    if (val.IsActive == true) {
                        bclass = "label label-success";
                        bdata = "Enabled";
                        btitle = "Client credentials active"
                    }
                    if (val.IsActive == false) {
                        bclass = "label label-danger";
                        bdata = "Disabled";
                        btitle = "Client credentials inactive";
                    }
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    $row.append($('<td class="s" valign="top" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.LoginId + "'/> "));
                    $row.append($('<td class="IsCompany" />').html("<span>" + (val.IsCompany != null ? val.IsCompany : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="companyname iscompanyindicidualclass" />').html("<span name = '" + val.CompanyName + "' style='cursor:pointer;color:#069' data-id='" + val.CompanyId + "' title='View Client Contacts List' id='companydetails'    >" + (val.CompanyName != null ? val.CompanyName : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="city" />').html("<span>" + (val.City != null ? val.City : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="cufname" />').html("<span name = '" + val.cufname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.cufname != null ? val.cufname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="clname" />').html("<span name = '" + val.clname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.clname != null ? val.clname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="mobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="ccemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="userid" />').html("<span name='" + val.Username + "'>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.Username == null || val.Username == "" || val.Username == "null") {
                        if (String(roleids) == "1" || (String(userid.toLowerCase()) == val.firmuser.toLowerCase() && val.credentials == 1) || (String(IsViewAll) == "1" && val.credentials == 1)) {
                            $row.append($('<td class="cstatus" />').html("<span style='cursor:pointer' title='Create User ID password for Client' data-val='" + val.LoginId + "'  class='label label-default' id='CreateClientlogin'> Create Credentials</span>"));
                        }
                        else {
                            $row.append($('<td class="cstatus" />').html("&nbsp;"));
                        }
                    }
                    else {
                        $row.append($('<td  title=' + btitle + ' class="cstatus"/>').html("<span class='" + bclass + "' title='" + btitle + "'>" + (bdata != "" ? bdata : '<span style="visibility: hidden;">.</span>')));
                    }
                    $row.append($('<td class="createdby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.oedit == 1 || roleids == 1) {
                        $row.append($('<td  />').html("<span class='glyphicon glyphicon-pencil' id='editclient' style='color:#069;cursor:pointer;' title='Edit client' id-val=" + val.LoginId + "></span>"));
                    }
                    else {
                        $row.append($('<td />').html(""));
                    }
                    $row.append($('<td class="ContactType" />').html("<span>Client</span>"));
                    $row.append($('<td class="CompanyStructure" />').html("<span>" + (val.CompanyStructure != null ? val.CompanyStructure : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $("#cloadactivitydatas").append($row);
                });
                hideshowcompanycolumnbyfilter();
                // hideEmptyCols($("#example"));
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(cld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            if (cflaghide == true) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                cflaghide = false;
            }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    /*Load contact list for company*/
    function cloadcontactlistforcompany(cpageindexcom, token) {
        $("#cloadactivitydatasforcomapny").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        cltype = $('#Clistctype').val();
        if (cltype == "") {
            var cltype = "Client";
        }
        if (cltype != "Client") {
            cltype = "Client";
        }
        //fillvalue 
        formdata.append("pagenum", EncodeText(cpageindexcom));
        formdata.append("pagesize", EncodeText(cpagesizecom));
        formdata.append("search", EncodeText(token));
        formdata.append("type", EncodeText(cltype));
        var ajaxTime = new Date().getTime();
        openload();
        var cld12 = $.ajax({
            async: true,
            url: '/api/CallApi/NewContactsDataForCompany',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#ctfooterforcompany").html("");
                $("#ctokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var clength = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#cdatastatus").html("");
                    closeload();
                }
                else {
                    $("#cdatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                $("#cloadactivitydatasforcomapny tr").remove();
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        cfirstvalue = val.rownum;
                    }
                    if (i === (clength - 1)) {
                        var cpnext = cpageindexcom;
                        var cpprev = cpageindexcom;
                        var cpageno = cpageindexcom;
                        var ctotdata = val.totRow;
                        var ctotpage = 0;
                        if (val.totRow > 0) {
                            cpnext = parseInt(cpnext) + 1;
                            if (cpnext == 0) cpnext = 1;
                            cpprev = parseInt(cpageno) - 1;
                            if (cpprev == 0) cpprev = 1;
                            ctotpage = parseInt(ctotdata) / parseInt(cpagesizecom);
                            if (parseInt(ctotdata) % parseInt(cpagesizecom) != 0) {
                                ctotpage = parseInt(ctotpage) + 1;
                            }
                            $("#cpagnumvalue").attr("max", ctotpage);
                        }
                        var ctfot = '';
                        ctfot += '<ul>'
                        ctfot += '<li>results <span>' + val.totRow + '</span>  <span id="csotopage" style="display:none">' + ctotpage + '</span></li>'
                        ctfot += '<li><span>|</span></li>'
                        ctfot += '<li>pages ' + cpageindexcom + '/ ' + parseInt(ctotpage) + '</li>'
                        ctfot += '<li><span>|</span></li>'
                        ctfot += '<li ><input type="number" id="cpagnumvalue" min="1" class="footerInput"><a class="gobtn"  style="cursor:pointer" type="button" id="cgetdatabypagenumforcompany" >Go</a> </li>'
                        if (val.totRow <= clength) {
                        }
                        else if (cpageno == 1) {
                        }
                        else if (cpageno == ctotpage) {
                            ctfot += '<li><span><a id="cpaginateforcompany"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'
                        }
                        else {
                            ctfot += '<li><span><a id="cpaginateforcompany"  title="Previous Page" href="javascript:void()" index="' + cpprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + cfirstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (cpageno < ctotpage) {
                            ctfot += '<a  id="cpaginateforcompany" title="Next Page" href="javascript:void()" index="' + cpnext + '" ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        ctfot += '</ul>'
                        $("#ctfooterforcompany").append(ctfot);
                        // closeload();
                    }
                    qty = qty + 1;
                    var btitle = "";
                    var bclass = "";
                    var bdata = "";
                    if (val.IsActive == true) {
                        bclass = "label label-success";
                        bdata = "Enabled";
                        btitle = "Client credentials active"
                        // alert(bdata);
                    }
                    if (val.IsActive == false) {
                        bclass = "label label-danger";
                        bdata = "Disabled";
                        btitle = "Client credentials inactive";
                        //alert(bdata);
                    }
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    $row.append($('<td class="s" valign="top" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.LoginId + "'/> "));
                    $row.append($('<td class="cufnamec" />').html("<span name = '" + val.cufname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.cufname != null ? val.cufname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="clnamec" />').html("<span name = '" + val.clname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'    >" + (val.clname != null ? val.clname : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="mobnoc" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="ccemailc" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="useridc" />').html("<span name='" + val.Username + "'>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.Username == null || val.Username == "" || val.Username == "null") {
                        if (String(roleids) == "1" || (String(userid.toLowerCase()) == val.firmuser.toLowerCase() && val.credentials == 1) || (String(IsViewAll) == "1" && val.credentials == 1)) {
                            if (packmodules == "2" || packmodules == "3") {
                                $row.append($('<td class="cstatusc" />').html("<span style='cursor:pointer' title='Create User ID password for Client' data-val='" + val.LoginId + "'  class='label label-default' id='CreateClientlogin'> Create Credentials</span>"));
                            }
                            else {
                                $row.append($('<td class="cstatusc" />').html("&nbsp;"));
                            }
                        }
                        else {
                            $row.append($('<td class="cstatusc" />').html("&nbsp;"));
                        }
                    }
                    else {
                        $row.append($('<td  title=' + btitle + ' class="cstatus"/>').html("<span class='" + bclass + "' title='" + btitle + "'>" + (bdata != "" ? bdata : '<span style="visibility: hidden;">.</span>')));
                    }
                    $row.append($('<td class="createdbyc" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.oedit == 1 || roleids == 1) {
                        $row.append($('<td  />').html("<span class='glyphicon glyphicon-pencil' id='editclient' style='color:#069;cursor:pointer;' title='Edit client' id-val=" + val.LoginId + "></span>"));
                    }
                    else {
                        $row.append($('<td />').html(""));
                    }
                    $row.append($('<td class="ContactTypec" />').html("<span>Client</span>"));
                    $row.append($('<td class="CompanyStructurec" />').html("<span>" + (val.CompanyStructure != null ? val.CompanyStructure : '<span style="visibility: hidden;">&nbsp;</span>')));
                    $row.append($('<td class="clientdocsc" />').html("<span style='cursor:pointer;text-align:center;' id-val='" + val.cid + "' id='filelink'><i class='glyphicon glyphicon-folder-open'></i></span>"));
                    $("#cloadactivitydatasforcomapny").append($row);
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(cld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            if (cflaghide == true) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                cflaghide = false;
            }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    ////////////////END Client/////////////
    ////////////////Start Others/////////////
    var otrgr = true;
    function loadmenu() {
        var qo = 2;
        if (otrgr == false) {
            return false;
        }
    }
    $(document).on('click', '#ogetdatabypagenum', function () {
        opageindex = $("#opagnumvalue").val();
        if (opageindex != "undefined") {
            if (Math.sign(opageindex) == 1) {
                var opageindesx = $("#osotopage").text();
                if (opageindex <= parseInt(opageindesx)) {
                    openload();
                    oloadcontactlist(opageindex);
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
    var chksflag = true;
    $(document).on('click', '#opaginate', function () {
        opageindex = $(this).attr("index");
        oloadcontactlist(opageindex);
    });
    function oloadtabledata() {
        var $otable = '';
        var $oheader = '';
        var $ohead1 = '';
        var dt = '';
        var q1 = 2;
        var sort = 10;
        $otable = $('<table id="oexample"   class="" style="overflow-x:auto;" /><tr><th>').addClass('table');
        var ort1 = $.ajax({
            async: true,
            type: 'POST',
            //url: '/api/Demo/SpColMaps1', '
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                // 'fid': type
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    $oheader = $('<thead>').html('');
                    $ohead1 += '<th><div class="thbg"><input type="checkbox" id="select_all"/></div></th>'
                    $ohead1 += '<th onclick="osortTable(1)" class="ocompanyname"><div class="thbg"><span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(2)" class="ocity"><div class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th class="ofname" onclick = "osortTable(3)" width = "10%" ><div class="thbg">First Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th class="olname" onclick = "osortTable(4)" width = "20%" ><div class="thbg">Last Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th  class="omobno"><div class="thbg"><span style="padding-right: 10px !important;">Mobile</span></div></th>';
                    $ohead1 += '<th  class="ocemail"><div class="thbg"><span style="padding-right: 10px !important;">Email</span></div></th>';
                    $ohead1 += '<th onclick="osortTable(7)" class="ocreatedby"><div class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $ohead1 += '<th onclick="osortTable(8)" class="oContactType"><div class="thbg"><span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $ohead1 += '<th  class="CompanyStructureother"><div class="thbg"><span style="padding-right: 10px !important;">CompanyStructure</span></div></th >';
                    $ohead1 += '<th><div class="thbg">&nbsp;&nbsp;&nbsp;Action&nbsp;&nbsp;&nbsp;</div></th>';
                    $oheader.append($ohead1);
                    $oheader.append('</thead>');
                    $otable.append($oheader);
                    $otable.append('<tbody style="clear:both" id="oloadactivitydatas">');
                    $('#oupdatePanel').html($otable);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(ort1).then(function (data, textStatus, jqXHR) {
            loadmenu();
            oloadcontactlist(pageindex);
        });
    }
    /*New Standard Contacts Data*/
    function oloadcontactlist(opageindex) {
        $("#oloadactivitydatas").html("");
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(opageindex));
        formdata.append("pagesize", EncodeText(opagesize));
        formdata.append("search", EncodeText($('#searchdata').val().replace(/\"/g, '').replace(/\'/g, '')));
        formdata.append("type", EncodeText($('#Clistctype').val()));
        formdata.append("iscomorindv", EncodeText($("#iscomorindividual").val()));
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/CallApi/Sp_NewStandardContactsData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#otfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var olength = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#odatastatus").html("");
                }
                else {
                    $("#odatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        ofirstvalue = val.rownum;
                    }
                    if (i === (olength - 1)) {
                        var opnext = opageindex;
                        var opprev = opageindex;
                        var opageno = opageindex;
                        var ototdata = val.totRow;
                        var ototpage = 0;
                        if (val.totRow > 0) {
                            opnext = parseInt(opnext) + 1;
                            if (opnext == 0) opnext = 1;
                            opprev = parseInt(opageno) - 1;
                            if (opprev == 0) opprev = 1;
                            ototpage = parseInt(ototdata) / parseInt(opagesize);
                            if (parseInt(ototdata) % parseInt(opagesize) != 0) {
                                ototpage = parseInt(ototpage) + 1;
                            }
                            $("#opagnumvalue").attr("max", ototpage);
                        }
                        var otfot = '';
                        otfot += '<ul>'
                        otfot += '<li>results <span>' + val.totRow + '</span>  <span id="osotopage" style="display:none">' + ototpage + '</span></li>'
                        otfot += '<li><span>|</span></li>'
                        otfot += '<li>pages ' + opageindex + '/ ' + parseInt(ototpage) + '</li>'
                        otfot += '<li><span>|</span></li>'
                        otfot += '<li ><input type="number" id="opagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="ogetdatabypagenum" >Go</a> </li>'
                        if (val.totRow <= olength) {
                        }
                        else if (opageno == 1) {
                        }
                        else if (opageno == ototpage) {
                            otfot += '<li><span><a id="opaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'                            //tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            otfot += '<li><span><a id="opaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (opageno < ototpage) {
                            otfot += '<a  id="opaginate" title="Next Page" href="javascript:void()" index="' + opnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        otfot += '</ul>'
                        $("#otfooter").append(otfot);
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var whtsdata = "";
                    if (val.fname != "" && val.fname != null) {
                        whtsdata = whtsdata.concat("Name: " + val.fname);
                    }
                    if (val.mname != "" && val.mname != null) {
                        whtsdata = whtsdata.concat(" " + val.mname);
                    }
                    if (val.lname != "" && val.lname != null) {
                        whtsdata = whtsdata.concat(" " + val.lname);
                    }
                    if (val.mobno != "" && val.mobno != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.mobno);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.cadd1 != "" && val.cadd1 != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.cadd1);
                    }
                    $row.append($('<td class="s" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.cid + "'/><a id='socialnetwork' style='display:none'  title='share to whatsapp'  href='whatsapp://send?text=" + whtsdata + "' data-action='share/whatsapp/share' class='fa fa-whatsapp socialnetwork socialwhats'></a>"));
                    $row.append($('<td class="companyname" />').html("<span name = '" + val.CompanyName + "' style='cursor:pointer;color:#069' data-id='" + val.CompanyId + "' title='View Client Contacts List' id='companydetails'    >" + (val.CompanyName != null ? val.CompanyName : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    $row.append($('<td class="ocity" />').html("<span>" + (val.City != null ? val.City : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ofname" />').html("<span>" + (val.fname != null ? val.fname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="olname" />').html("<span>" + (val.lname != null ? val.lname : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="omobno" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocemail" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocreatedby" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="oContactType" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="CompanyStructureother" />').html("<span>" + (val.CompanyStructure != null ? val.CompanyStructure : '<span style="visibility: hidden;">&nbsp;</span>')));
                    var proaction = '';
                    var proaction = '<td>';
                    if (val.oedit == 1 || roleids == 1) {
                        proaction += "<span class='glyphicon glyphicon-pencil' id='transferpage' style='color:#069;cursor:pointer;margin-right:5px;'title='Edit propsect' data-type=" + val.ProfileType + " data-id=" + val.cid + " sno=" + qty + "></span>|&nbsp;";
                    }
                    if (val.odelete == 1 || roleids == 1) {
                        proaction += "<span class='glyphicon glyphicon-trash' id='removeprospect' style='color: red; cursor: pointer; ' title='Remove propsect' id-val=" + val.cid + "></span>";
                    }
                    $row.append($('<td />').html(proaction));
                    var countcf = countcustomfoeld;

                    $("#oloadactivitydatas").append($row);
                    hideshowcompanycolumnbyfilter();
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            $("#searchdatas").removeAttr("disabled");
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
            closeload();
        });
    }
    ////////////////END Propect/////////////
    /////////////start all//////
    cflaghideall = true;
    function alladcontactlist(opageindex) {
        $("#alloadactivitydatas").html("");
        var allctypes = $('#Clistctype').val();
        if (allctypes == "null" || allctypes == null || allctypes == "") {
            allctypes = "all";
        }
        var fcode = localStorage.getItem("FirmCode");
        var formdata = new FormData();
        formdata.append("pagenum", EncodeText(opageindex));
        formdata.append("pagesize", EncodeText(opagesize));
        formdata.append("search", EncodeText($('#searchdata').val().replace(/\"/g, '').replace(/\'/g, '')));
        formdata.append("type", EncodeText(allctypes));
        formdata.append("iscomorindv", EncodeText($("#iscomorindividual").val()));
        var ajaxTime = new Date().getTime();
        openload();
        var ld12 = $.ajax({
            async: true,
            url: '/api/CallApi/Sp_NewStandardContactsData',
            data: formdata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (response) {
                var totalTime = new Date().getTime() - ajaxTime;
                console.log("loadcontact:" + totalTime)
                $("#alfooter").html("");
                $("#tokens").html("");
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    var olength = obj.length;
                }
                else {
                    //alert("not found");
                }
                if (response.Data.length > 2) {
                    $("#alldatastatus").html("");
                }
                else {
                    $("#alldatastatus").html("No result found");
                    closeload();
                }
                var qty = 0;
                var it = 2;
                var firstvalue = 0;
                $.each(obj, function (i, val) {
                    if (i === 0) {
                        ofirstvalue = val.rownum;
                    }
                    if (i === (olength - 1)) {
                        var opnext = opageindex;
                        var opprev = opageindex;
                        var opageno = opageindex;
                        var ototdata = val.totRow;
                        var ototpage = 0;
                        if (val.totRow > 0) {
                            opnext = parseInt(opnext) + 1;
                            if (opnext == 0) opnext = 1;
                            opprev = parseInt(opageno) - 1;
                            if (opprev == 0) opprev = 1;
                            ototpage = parseInt(ototdata) / parseInt(opagesize);
                            if (parseInt(ototdata) % parseInt(opagesize) != 0) {
                                ototpage = parseInt(ototpage) + 1;
                            }
                            $("#alpagnumvalue").attr("max", ototpage);
                        }
                        var alfot = '';
                        alfot += '<ul>'
                        alfot += '<li>results <span>' + val.totRow + '</span>  <span id="alsotopage" style="display:none">' + ototpage + '</span></li>'
                        alfot += '<li><span>|</span></li>'
                        alfot += '<li>pages ' + opageindex + '/ ' + parseInt(ototpage) + '</li>'
                        alfot += '<li><span>|</span></li>'
                        alfot += '<li ><input type="number" id="alpagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="algetdatabypagenum" >Go</a> </li>'
                        if (val.totRow <= olength) {
                        }
                        else if (opageno == 1) {
                        }
                        else if (opageno == ototpage) {
                            alfot += '<li><span><a id="alpaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'                            //tfot += '<a id="paginate" class="btn btn-default" title="Previous Page" href="javascript:void()" index="' + pprev + '" ><i class="glyphicon glyphicon-chevron-left"></i> Previous </a>'
                        }
                        else {
                            alfot += '<li><span><a id="alpaginate"  title="Previous Page" href="javascript:void()" index="' + opprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + ofirstvalue + '-' + val.rownum + '  <span>'
                        }
                        if (opageno < ototpage) {
                            alfot += '<a  id="alpaginate" title="Next Page" href="javascript:void()" index="' + opnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                        }
                        alfot += '</ul>'
                        $("#alfooter").append(alfot);
                        // closeload();
                    }
                    qty = qty + 1;
                    $("#tokens").append('<input type="hidden" id="hid' + qty + '" value="' + val.cid + '">')
                    it = it + 1;
                    if (String(val.IsSync) == "1") {
                        dsyncicon = "glyphicon glyphicon-retweet";
                        dsynctitle = "Marked for data synchronization";
                    }
                    else {
                        dsyncicon = "";
                        dsynctitle = "";
                    }
                    var $row = $('<tr>');
                    var btitle = "";
                    var bclass = "";
                    var bdata = "";
                    if (val.IsActive == true) {
                        bclass = "label label-success";
                        bdata = "Enabled";
                        btitle = "Client credentials active"
                    }
                    if (val.IsActive == false) {
                        bclass = "label label-danger";
                        bdata = "Disabled";
                        btitle = "Client credentials inactive";
                    }
                    var whtsdata = "";
                    if (val.fname != "" && val.fname != null) {
                        whtsdata = whtsdata.concat("Name: " + val.fname);
                    }
                    if (val.mname != "" && val.mname != null) {
                        whtsdata = whtsdata.concat(" " + val.mname);
                    }
                    if (val.lname != "" && val.lname != null) {
                        whtsdata = whtsdata.concat(" " + val.lname);
                    }
                    if (val.mobno != "" && val.mobno != null) {
                        whtsdata = whtsdata.concat(",Mobile: " + val.mobno);
                    }
                    if (val.cemail != "" && val.cemail != null) {
                        whtsdata = whtsdata.concat(",Email: " + val.cemail);
                    }
                    if (val.cadd1 != "" && val.cadd1 != null) {
                        whtsdata = whtsdata.concat(",Address: " + val.cadd1);
                    }
                    //var whtsdata = "Name:" + (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') + (val.mobno != null ? ", Mobile:" + val.mobno : '') + ((val.cemail !="" || val.cemail != null) ? ", Email1:" + val.cemail : '') + (val.cadd1 != null ? ", Address:" + val.cadd1 : '') + (val.cwebsite != null ? ", Website:" + val.cwebsite : '');
                    $row.append($('<td class="s" />').html("<span><input style='margin:-20px 0 0 0' type='checkbox' id='task' class='checkbox' ntype='task'  value='" + val.cid + "'/><a id='socialnetwork' style='display:none'  title='share to whatsapp'  href='whatsapp://send?text=" + whtsdata + "' data-action='share/whatsapp/share' class='fa fa-whatsapp socialnetwork socialwhats'></a>"));
                    if (val.ProfileType == "Client") {
                        $row.append($('<td class="oContactTypeal" />').html("<span>Client</span>"));
                    }
                    else if (val.ProfileType == "") {
                        $row.append($('<td class="oContactTypeal" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    }
                    else {
                        $row.append($('<td class="oContactTypeal" />').html("<span>" + (val.ProfileType != null ? val.ProfileType : '<span style="">&nbsp;</span>')));
                    }
                    $row.append($('<td class="ocompanynameal iscompanyindicidualclass" />').html("<span name = '" + val.CompanyName + "' style='cursor:pointer;color:#069' data-id='" + val.CompanyId + "' title='View Client Contacts List' id='companydetails'    >" + (val.CompanyName != null ? val.CompanyName : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                    // $row.append($('<td class="ocompanynameal" />').html("<span>" + (val.CompanyName != null ? val.CompanyName : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocityal" />').html("<span>" + (val.City != null ? val.City : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="olclienttype" />').html("<span>" + (val.IsCompany != null ? val.IsCompany : '<span style="">&nbsp;</span>')));
                    if (val.ProfileType == "Client" || val.ProfileType == "") {
                        $row.append($('<td class="ofnameal" />').html("<span name='" + val.fname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'  >" + (val.fname != null ? val.fname : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="olnameal" />').html("<span name='" + val.lname + "' style='cursor:pointer;color:#069' data-id='" + val.LoginId + "' title='View matter list' id='transferpagetocase'  >" + (val.lname != null ? val.lname : '<span style="">&nbsp;</span>')));
                    }
                    else {
                        // $row.append($('<td class="ofnameal" />').html("<span>" + (val.fname != "" ? (val.fname != null ? val.fname : '') + " " + (val.mname != null ? val.mname : '') + " " + (val.lname != null ? val.lname : '') : '<span style="visibility: hidden;">&nbsp;</span>') + '<i class="' + dsyncicon + ' pull-right" title="' + dsynctitle + '"></i>'));
                        $row.append($('<td class="ofnameal" />').html("<span name='" + val.fname + "'>" + (val.fname != null ? val.fname : '<span style="">&nbsp;</span>')));
                        $row.append($('<td class="olnameal" />').html("<span name='" + val.lname + "'>" + (val.lname != null ? val.lname : '<span style="">&nbsp;</span>')));
                    }
                    $row.append($('<td class="omobnoal" />').html("<span>" + (val.mobno != null ? val.mobno : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocemailal" />').html("<span>" + (val.cemail != null ? val.cemail : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocreatedbyal" />').html("<span>" + (val.CreatedBy != null ? val.CreatedBy : '<span style="">&nbsp;</span>')));
                    $row.append($('<td class="ocuserid" />').html("<span>" + (val.Username != null ? val.Username : '<span style="visibility: hidden;">&nbsp;</span>')));
                    if (val.Username == null || val.Username == "" || val.Username == "null") {
                        if (String(roleids) == "1" || (String(userid.toLowerCase()) == val.firmuser.toLowerCase() && val.credentials == 1) || (String(IsViewAll) == "1" && val.credentials == 1)) {
                            if (packmodules == "2" || packmodules == "3") {
                                if (val.ProfileType == "Client") {
                                    $row.append($('<td class="ocstatus" />').html("<span style='cursor:pointer' title='Create User ID password for Client' data-val='" + val.LoginId + "'  class='label label-default' id='CreateClientlogin'> Create Credentials</span>"));
                                }
                                else {
                                    $row.append($('<td class="ocstatus" />').html("&nbsp;"));
                                }
                            }
                            else {
                                $row.append($('<td class="ocstatus" />').html("&nbsp;"));
                            }
                        }
                        else {
                            $row.append($('<td class="ocstatus" />').html("&nbsp;"));
                        }
                    }
                    else {
                        if (val.ProfileType == "Client") {
                            $row.append($('<td  title=' + btitle + ' class="ocstatus"/>').html("<span class='" + bclass + "' title='" + btitle + "'>" + (bdata != "" ? bdata : '<span style="visibility: hidden;">.</span>')));
                        }
                        else {
                            $row.append($('<td class="ocstatus" />').html("&nbsp;"));
                        }
                    }
                    $row.append($('<td class="ostateal" />').html("<span>" + (val.State != null ? val.State : '<span style="">&nbsp;</span>')));
                    var countcf = countcustomfoeld;
                    if (val.odelete == 1 || roleids == 1) {
                        if (val.ProfileType == "") {
                            var proaction1 = '';
                            var proaction1 = '<td>';
                            proaction1 += "<span class='glyphicon glyphicon-pencil' id='transferpage' style='color:#069;cursor:pointer;margin-right:5px;'title='Edit propsect'  data-id=" + val.cid + " sno=" + qty + "></span>";
                            proaction1 += "&nbsp;<span class='glyphicon glyphicon-trash' id='removeprospect' style='color: red; cursor: pointer; ' title='Remove propsect' id-val=" + val.cid + "></span>";
                            $row.append($('<td />').html(proaction1));
                        }
                        else {
                            var proaction = '';
                            var proaction = '<td>';
                            if (val.oedit == 1 || roleids == 1) {
                                if (val.ProfileType == "Client") {
                                    proaction += "<span class='glyphicon glyphicon-pencil' id='editclient' style='color:#069;cursor:pointer;margin-right:5px;' title='Edit client' id-val=" + val.LoginId + "></span>";
                                }
                                else {
                                    proaction += "<span class='glyphicon glyphicon-pencil' id='transferpage' style='color:#069;cursor:pointer;margin-right:5px;'title='Edit propsect' data-type=" + val.ProfileType + " data-id=" + val.cid + " sno=" + qty + "></span>|&nbsp;";
                                }
                            }
                            if (val.odelete == 1 || roleids == 1) {
                                if (val.ProfileType == "Client") {
                                    if (val.IsclientMatter == 0) {
                                        proaction += "<span class='glyphicon glyphicon-trash' id='removeclient' style='color: red; cursor: pointer; ' title='Remove client' idss=" + val.CompanyId + " id-val=" + val.cid + "></span>";
                                    }
                                }
                                else {
                                    proaction += "<span class='glyphicon glyphicon-trash' id='removeothers' style='color: red; cursor: pointer; ' title='Remove' id-val=" + val.cid + "></span>";
                                }
                            }
                            $row.append($('<td />').html(proaction));
                        }
                    }
                    else {
                        $row.append($('<td />').html(""));
                    }
                    $("#alloadactivitydatas").append($row);
                    hideshowcompanycolumnbyfilter();
                    //$("#loadactivitydata").html($row);
                });
            },
            error: function (response) {
                alert(response.responseText);
            }
        });
        $.when(ld12).then(function (data, textStatus, jqXHR) {
            loadmenuall();
            $("#searchdatas").removeAttr("disabled");
            if (cflaghide == true) {
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
                $("input:checkbox").click(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).toggle();
                });
                cflaghide = false;
            }
            $("input:checkbox:not(:checked)").each(function () {
                var column = "table ." + $(this).attr("name");
                $(column).hide();
            });
        });
    }
    function hideshowcompanycolumnbyfilter() {
        var takecategory = $("#iscomorindividual").val();
        if (takecategory == "0") {
            $(".iscompanyindicidualclass").css("display", "none");
        }
        else {
            $(".iscompanyindicidualclass").css("display", "table-cell");
        }
    }
    /*Load table data*/
    function allloadtabledata() {
        var $altable = '';
        var $alheader = '';
        var $alhead1 = '';
        var dt = '';
        var q1 = 2;
        var sort = 10;
        $altable = $('<table id="alexample"  class="" style="overflow-x:auto;" /><tr><th>').addClass('table');
        var alrt1 = $.ajax({
            async: true,
            type: 'POST',
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                    countcustomfoeld = obj.length;
                    $alheader = $('<thead>').html('');
                    $alhead1 += '<th><div class="thbg"><input type="checkbox" id="select_all"/></div></th>'
                    $alhead1 += '<th onclick="asortTable(1)" class="oContactTypeal"><div class="thbg"><span style="padding-right: 10px !important;">Contact Type</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $alhead1 += '<th onclick="asortTable(2)" class="ocompanynameal iscompanyindicidualclass"><div class="thbg"><span style="padding-right: 10px !important;">Company Name</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alhead1 += '<th onclick="asortTable(3)" class="ocityal"><div class="thbg"><span style="padding-right: 10px !important;">City</span><span class="fa fa-fw fa-sort "></span></div></th >';
                    $alhead1 += '<th class="olclienttype" onclick = "asortTable(4)" width = "20%" > <div class="thbg">Client Type <span class="fa fa-fw fa-sort pull-right" ></span></div></th>';
                    $alhead1 += '<th class="ofnameal" onclick = "asortTable(5)" width = "10%" ><div class="thbg">First Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $alhead1 += '<th class="olnameal" onclick = "asortTable(6)" width = "10%" ><div class="thbg">Last Name <span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $alhead1 += '<th  class="omobnoal"><div class="thbg"><span style="padding-right: 10px !important;">Mobile Number</span></div></th>';
                    $alhead1 += '<th  class="ocemailal"><div class="thbg"><span style="padding-right: 10px !important;">Email ID</span></div></th>';
                    $alhead1 += '<th onclick="asortTable(9)" class="ocreatedbyal"><div class="thbg"><span style="padding-right: 10px !important;">Created By</span><span class="fa fa-fw fa-sort pull-right"></span></div></th >';
                    $alhead1 += '<th onclick="asortTable(10)" class="ocuserid"><div class="thbg"><span style="padding-right: 20px !important;">UserId</span><span class="fa fa-fw fa-sort pull-right"></span></div></th>';
                    $alhead1 += '<th  class="ocstatus"><div class="thbg"><span style="padding-right: 10px !important;">Status</span></div></th>';
                    $alhead1 += '<th onclick="asortTable(18)" class="ostateal"><span style="padding-right: 10px !important;">State</span><span class="fa fa-fw fa-sort pull-right"></span></th >';
                    $alheader.append($alhead1);
                    $alheader.append('<th width="7%" ><div class="thbg"><span style=""></span>Action</div></th>');
                    $alheader.append('</thead>');
                    $altable.append($alheader);
                    $altable.append('<tbody style="clear:both" id="alloadactivitydatas">');
                    $('#allupdatePanel').html($altable);
                }
                else {
                    //  alert("not found");
                }
            },
            error: function () {
                alert('Error!');
            }
        });
        $.when(alrt1).then(function (data, textStatus, jqXHR) {
            // loadmenu();
            alladcontactlist(alpageindex);
        });
    }
    //Load all menu
    function loadmenuall() {
        var qo = 2;
        $.ajax({
            async: true,
            type: "POST",
            url: '/api/demo/FirmEmployeescreate1',
            headers: {
                // 'fid': type
                'configurationtype': 11
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status == true) {
                    var datas = JSON.stringify(response);
                    var obj = JSON.parse(response.Data);
                }
                else {
                    alert("not found");
                }
                $("#odal li input:checkbox:not(:checked)").each(function () {
                    var column = "#alexample ." + $(this).attr("name");
                    $(column).hide();
                });
                closeload();
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $(document).on('click', '#alpaginate', function () {
        /* your code here */
        cpageindex = $(this).attr("index");
        alladcontactlist(cpageindex);
    });
    $(document).on('click', '#algetdatabypagenum', function () {
        ppageindex = $("#alpagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#alsotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    alladcontactlist(ppageindex);
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
    //////end///////////////
    var fcode = localStorage.getItem("FirmCode");
    $(document).on('click', '#editclient', function () {
        var loginid = $(this).attr("id-val");
        var urls = "/" + fcode + "/Firm/EditClient";
        url_redirect({
            url: urls,
            method: "post",
            data: { "loginid": loginid }
        });
    });
    $(document).on("click", ".btn_more", function () {
        var token = $('#Clistctype option:selected').text();
        var category = $('#iscomorindividual').val();
        var urls = "/" + fcode + "/Firm/ContactsList";
        url_redirect({
            url: urls,
            method: "post",
            data: { "clienttoken": token, "iscompany": category }
        });
    });
    $('#clusername').keyup(function () {
        var dInput = this.value;
        if (dInput.length < 5) {
            $('#useriderror').text('kindly enter minimum 5 characters .');
        }
        else {
            $('#useriderror').text('');
        }
    });
    //Reset custmized fields
    // $(document).on('click', '#resetcf', function () {
    $("#resetcf").click(function () {
        var result = confirm("Do you want to remove the added custom fields?");
        if (result) {
            openload();
            $.ajax({
                async: true,
                type: "POST",
                url: "/api/matterApi/ResetCF",
                headers: {
                    'configurationtype': type
                },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    $("#content").html("");
                    var datas = JSON.stringify(data);
                    // loadfieldcount();
                    //$('.save').prop("disabled", false);
                    new PNotify({
                        title: 'Success!',
                        text: 'Custom fields removed successfully. A history of custom fields can be viewed in Custom Field History section.',
                        type: 'success',
                        delay: 3000
                    });
                    closeload();
                    //console.log(datas);
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
});