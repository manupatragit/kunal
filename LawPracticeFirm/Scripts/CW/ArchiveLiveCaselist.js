/*Add court name*/
function AddCourtName(strcourttype) {
    $.ajax({
        type: "POST",
        url: "/AddCase/AddCourtNameByCourtType?courttype=" + strcourttype,
        dataType: "json",
        success: function (data) {
            $("#drpcourtname").append("<option value='0'>-Select Court Name-</option>");
            $("#drpcourtnameDC").append("<option value='0'>Select Your State / UT</option>");
            for (var i = 0; i < data.length; i++) {
                if (strcourttype != "3") {
                    $("#drpcourtname").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
                else {
                    $("#drpcourtnameDC").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            }
        },
        error: function (data) {
        }
    });
}
/*Dropdown for DC court name*/
function divdrpcourtnameDC() {
    $("#drpdistrictcourtname").empty();
    var selectedText = "";
    document.getElementById('drpcourtcomplexestb').style.display = 'none';
    document.getElementById('drpdistrictcourtname').style.display = 'none';
    document.getElementById('drpcompestbcourt').style.display = 'none';
    if (document.getElementById('drpcourtnameDC').value != "0") {
        document.getElementById('drpdistrictcourtname').style.display = 'block';
        var skillsSelect = document.getElementById("drpcourtnameDC");
        var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
        $.ajax({
            type: "POST",
            url: "/AddCase/AddDistrictByCourt?courttype=" + document.getElementById('drpcourtnameDC').value,
            dataType: "json",
            success: function (data) {
                $("#drpdistrictcourtname").append("<option value='0'>Please Select District</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpdistrictcourtname").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
}
/*Change dropdown for district court*/
function divdistrictchange() {
    document.getElementById('drpcourtcomplexestb').style.display = 'none';
    document.getElementById('drpcompestbcourt').style.display = 'none';
    if (document.getElementById('drpdistrictcourtname').value != "0") {
        document.getElementById('drpcourtcomplexestb').style.display = 'block';
        document.getElementById('drpcourtcomplexestb').value = '';
        $.ajax({
            type: "POST",
            url: "/Firm/FillCourtComplexSTB",
            dataType: "json",
            success: function (data) {
                $("#drpcourtcomplexestb").empty();
                $("#drpcourtcomplexestb").append("<option value=''>Please Select</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpcourtcomplexestb").append("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
}
function drpcourtcompestbchange() {
    var courtype = "";
    var districttype = "";
    var compesttype = "";
    $('#drpcompestbcourt').empty();
    document.getElementById('drpcompestbcourt').style.display = 'none';
    if (document.getElementById('drpcourtcomplexestb').value != "") {
        courtype = document.getElementById('drpcourtnameDC').value;
        districttype = document.getElementById('drpdistrictcourtname').value;
        compesttype = document.getElementById('drpcourtcomplexestb').value;
        $.ajax({
            type: "POST",
            url: "/AddCase/AddCourtComplexEstType?crttype=" + courtype + "&dsttype=" + districttype + "&compesttype=" + compesttype,
            dataType: "json",
            success: function (data) {
                $("#drpcompestbcourt").append("<option value=''>Please Select District Court</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpcompestbcourt").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            },
            error: function (data) {
            }
        });
        document.getElementById('drpcompestbcourt').style.display = 'unset';
    }
}
$(document).ready(function () {
    /*Display SCHC district dropdown div*/
    function divSCHCDistrictdisplay() {
        try {
            document.getElementById('HighCourt').style.display = 'none';
            document.getElementById('drpcourtcomplexestb').style.display = 'none';
            document.getElementById('drpdistrictcourtname').style.display = 'none';
            document.getElementById('drpcompestbcourt').style.display = 'none';
            document.getElementById('drpcourtnameDC').style.display = "none";
            $("#drpdistrictcourtname").val("");
            $('#drpcourtname').empty();
            $('#drpcourtnameDC').empty();
            document.getElementById('drpcourtnameDC').style.border = "unset";
            document.getElementById('drpcourtcomplexestb').style.border = "unset";
            document.getElementById('drpcompestbcourt').style.border = "unset";
            if (document.getElementById('divSCHCDistrict').value == "2" || document.getElementById('divSCHCDistrict').value == "4") {
                document.getElementById('HighCourt').style.display = 'block';
                AddCourtName(document.getElementById('divSCHCDistrict').value);
            }
            else if (document.getElementById('divSCHCDistrict').value == "3") {
                document.getElementById('DistrictCourt').style.display = 'block';
                document.getElementById('drpcourtnameDC').style.display = "block";
                AddCourtName('3');
            }
        }
        catch (ex) {
            alert(ex.message);
        }
    }
    /*Get data by page number*/
    var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    loaddatalist(ppageindex);
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    /*paginate*/
    var chksflag = true;
    $(document).on('click', '#paginate', function () {
        /* your code here */
        ppageindex = $(this).attr("index");
        loaddatalist(ppageindex);
    });
    var fcode = localStorage.getItem("FirmCode");
    $("#drpcompestbcourt,#drpcourtname,#drpcourtnameDC,#drpdistrictcourtname,#drpcourtcomplexestb").change(function () {
        loaddatalist(pageindex);
    });
    /*SCHC district div*/
    $("#divSCHCDistrict").change(function () {
        if ($(this).val() == "3") {
            $("#allcasediv").hide();
            $("#casediv").show();
        }
        else {
            $("#casediv").hide();
            $("#allcasediv").show();
        }
        divSCHCDistrictdisplay();
        loaddatalist(pageindex);
    });
    /*Get archive court*/
    $("#archivecase").click(function () {
        selectedID = [];
        archivecase();
        function archivecase() {
            var result = confirm("Are you sure to unarchive case?");
            if (result) {
                $('input:checkbox.checkboall').each(function () {
                    if ($(this).prop('checked')) {
                        selectedID.push($(this).val());
                    }
                });
                if (JSON.stringify(selectedID) != "[]") {
                    openload();
                    $.ajax({
                        async: true,
                        url: '/CW/RemoveCasetoArchive',
                        data: JSON.stringify(selectedID),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (response) {
                            selectedID = [];
                            alert("Case removed from archived Successfully");
                            $('#select_all').prop('checked', false);
                            loaddatalist(pageindex);
                            closeload();
                        },
                        error: function () {
                            alert('Error!');
                            closeload();
                        }
                    });
                }
                else {
                    alert("Please select a row to archive case.");
                    closeload();
                }
            }
        }
    });
    /*Select all details*/
    $(document).on("click", "#select_all", function () {
        $(".checkboall").prop('checked', $(this).prop('checked'));
    });
    FillCourtType();
    /*Fill court type details*/
    function FillCourtType() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/Firm/FillCourt",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var option = '';
                $.each(response, function (i, a) {
                    option += '<option value="' + a["id"] + '" >  ' + a["courtname"] + '</option>';
                });
                $("#divSCHCDistrict").append(option);//End of foreach Loop
                loaddatalist(pageindex);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    /*Load data list*/
    function loaddatalist(pageindex) {
        var formData = new FormData();
        formData.append("courttype", $("#divSCHCDistrict").val());
        formData.append("courtname", $("#drpcourtname").val());
        formData.append("stateid", $("#drpcourtnameDC").val());
        formData.append("districtid", $("#drpdistrictcourtname").val());
        formData.append("courtcompestname", $("#drpcourtcomplexestb").val());
        formData.append("ditrictcourt", $("#drpcompestbcourt").val());
        formData.append("pagenum", pageindex);
        formData.append("pagesize", pagesize);
        openload();
        var html3 = '';
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/CWMyArchiveCases",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                var qty = 0;
                if (length > 0) {
                    $("#divalertlist tr").remove();
                    $.each(response1, function (i, val) {
                        if (i === 0) {
                            firstvalue = val.RowId;
                        }
                        if (i === (length - 1)) {
                            var pnext = pageindex;
                            var pprev = pageindex;
                            var pageno = pageindex;
                            var totdata = val.TotalRecord;
                            var totpage = 0;
                            if (val.TotalRecord > 0) {
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
                            tfot += '<li>results <span>' + val.TotalRecord + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                            tfot += '<li><span>|</span></li>'
                            tfot += '<li ><input type="number" id="pagnumvalue" min="1"  class="footerInput"><a class="gobtn" style="cursor:pointer" type="button" id="getdatabypagenum" style="margin-left:10px;">Go</button> </li>'
                            if (val.TotalRecord <= length) {
                            }
                            else if (pageno == 1) {
                            }
                            else if (pageno == totpage) {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.RowId + '  <span>'
                            }
                            else {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><img src="/newassets/images/arrow_left.png" ></a></span>  ' + firstvalue + '-' + val.RowId + '  <span>'
                            }
                            if (pageno < totpage) {
                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><img src="/newassets/images/arrow_right.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            }
                            tfot += '</ul>'
                            $("#ptfooter").html("");
                            $("#ptfooter").html(tfot);
                        }
                        var RowId = val.RowId;
                        var TotalRecord = val.TotalRecord;
                        var casenotfoundcolorstyle = "";
                        if (String(val.CaseName) == "Case not available") {
                            casenotfoundcolorstyle = "background: #eb7373;color: white;font-size: 14px;background: #d55555;text-align: center;color: White;padding: 10px 0;";
                        }
                        if ($("#divSCHCDistrict").val() == "3") {
                            html3 += '<tr>'
                            html3 += '<td><input type="checkbox" class="checkboall"  id="casecheckbox" value="' + val.UserCaseId + '"></td>'
                            html3 += '<td>' + val.CaseDairy + '</td>'
                            html3 += '<td>' + val.Court + '</td>'
                            html3 += '<td>' + val.District + '</td>'
                            html3 += '<td>' + val.CourtComplexCourtEstablishmentType + '</td>'
                            html3 += '<td>' + val.CourtComplexCourtEstablishment + '</td>'
                            html3 += '<td style="' + casenotfoundcolorstyle + '">' + (val.CaseName == null ? "" : val.CaseName) + '</td>'
                            html3 += '<td>' + (val.Advocate == null ? "" : val.Advocate) + '</td>'
                            html3 += '<td>' + val.NextHearing + '</td>'
                            html3 += '<td>' + val.DisposedDate + '</td>'
                            html3 += '<td>' + (val.Status == null ? "" : val.Status) + '</td>'
                            html3 += '</tr>'
                        }
                        else {
                            html3 += '<tr>'
                            html3 += '<td><input type="checkbox" class="checkboall" id="casecheckbox" value="' + val.UserCaseId + '"></td>'
                            html3 += '<td>' + val.CaseDairy + '</td>'
                            html3 += '<td>' + val.Court + '</td>'
                            html3 += '<td style="' + casenotfoundcolorstyle + '">' + (val.CaseName == null ? "" : val.CaseName) + '</td>'
                            html3 += '<td>' + (val.Advocate == null ? "" : val.Advocate) + '</td>'
                            html3 += '<td>' + val.NextHearing + '</td>'
                            html3 += '<td>' + val.DisposedDate + '</td>'
                            html3 += '<td>' + (val.Status == null ? "" : val.Status) + '</td>'
                            html3 += '</tr>'
                        }
                    });
                } else {
                    html3 += '<tr>'
                    if ($("#divSCHCDistrict").val() == "3") {
                        html3 += '<td colspan=11 align=center>Data Not Found</td>'
                    }
                    else {
                        html3 += '<td colspan=11 align=center>Data Not Found</td>'
                    }
                    html3 += '<tr>'
                }
                $("#districtdatabind,#alldatabind").html("");
                if ($("#divSCHCDistrict").val() == "3") {
                    $("#districtdatabind").html("").html(html3);
                }
                else {
                    $("#alldatabind").html("").html(html3);
                }
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
    }
});