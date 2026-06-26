$(document).ready(function () {
    var pageindex = 1, pagesize = 50, recordcount = 0, totrecord = 0;
    var fcode = localStorage.getItem("FirmCode");
    var fcode = localStorage.getItem("FirmCode");
    GetSCHCTCCourt(2);
    /*All display dashboard court details*/
    function AllDisplayboardCourt() {
        var html3 = '';
        var formData = new FormData();
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/AllDisplayboardCourt",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                if (length > 0) {
                    $("#divSCHC option").remove();
                    $.each(response1, function (i, a) {
                        var court_bench = a.CourtId;
                        html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                    });
                }
                $("#divSCHC").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    /*Get search by party name details by page number*/
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    GetSearchByPartyName();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    /*Paginate*/
    var chksflag = true;
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        GetSearchByPartyName();
    });
    $("#btnSearch").click(function () {
        var txtApplent = $("#txtApplent").val();
        if (txtApplent == "") {
            alert("Enter Party Name");
            return false;
        }
        GetSearchByPartyName();
    });
    $("#closemodelsparty").click(function () {
    });
    /*Add party name details*/
    var iscall = true;
    $(document).on('click', '#Addbyparty', function () {
        var ids = $(this).attr("data-id");
        var courtype = $(this).attr("data-court");
        var partsearchid = ids;
        var partycourttype = courtype;
        localStorage.setItem("partsearchid", partsearchid);
        localStorage.setItem("partycourttype", partycourttype);
        var partsearchi = localStorage.getItem("partsearchid");
        var partycourttype = localStorage.getItem("partycourttype");
        var formData = new FormData();
        formData.append("Courttype", courtype);
        formData.append("Id", ids);
        if (iscall == true) {
            $.ajax({
                async: true,
                type: "POST",
                url: "/CW/PartyNameDetailsbyAppealNo",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response1) {
                    $('#closemodels22').click();
                    openload();
                    var length = response1.length;
                    if (length > 0) {
                        $.each(response1, function (i, val) {
                            if (partycourttype == "1" && val.Court == "SC") {
                                $("#divSCHCDistrict").val(1).change();
                                setTimeout(function () {
                                    $("#drptype").val(val.CaseType.trim());
                                    $("#txtno").val(val.Caseno.trim());
                                    $("#drpYear").val(val.CaseYear.trim());
                                }, 5000);
                            }
                            if (partycourttype == "1" && val.Court == "MH") {
                                $("#divSCHCDistrict").val(2).change();
                                setTimeout(function () {
                                    $("#drpcourtname").val(val.Court.trim()).change();
                                }, 2000);
                                setTimeout(function () {
                                    $("#drpbench").val(val.Bench.trim()).change();
                                    $("#drptype").val(val.CaseType.trim());
                                    $("#txtno").val(val.Caseno.trim());
                                    $("#drpYear").val(val.CaseYear.trim());
                                }, 5000);
                            }
                            if (partycourttype == "1" && val.Court != "SC") {
                                $("#divSCHCDistrict").val(2).change();
                                setTimeout(function () {
                                    $("#drpcourtname").val(val.Court.trim()).change();
                                    var lvcourt = val.Court.trim();
                                    if (lvcourt == 'TN') {
                                        document.getElementById("divTN").style.display = "block";
                                        document.getElementById("divTNBench").style.display = "block";
                                        document.getElementById("divTNBench").value = val.Bench.trim();
                                        if (document.getElementById("divTNBench").value == "") {
                                            document.getElementById("divTNBench").value = "";
                                        }
                                        $("#divTNBench").change();
                                    }
                                    if (lvcourt == 'RH') {
                                        document.getElementById('divRH').style.display = "block";
                                        document.getElementById('divRHBench').style.display = "block";
                                        document.getElementById("divRHBench").value = val.Bench.trim();
                                        if (document.getElementById("divRHBench").value == "") {
                                            document.getElementById("divRHBench").value = "";
                                        }
                                        $("#divRHBench").change();
                                    }
                                    if (lvcourt == 'JK') {
                                        document.getElementById('divJK').style.display = "block";
                                        document.getElementById('divJKBench').style.display = "block";
                                        document.getElementById("divJKBench").value = val.Bench.trim();
                                        if (document.getElementById("divJKBench").value == "") {
                                            document.getElementById("divJKBench").value = "";
                                        }
                                        $("#divJKBench").change();
                                    }
                                    if (lvcourt == 'MP') {
                                        document.getElementById("divMP").style.display = "block";
                                        document.getElementById("divMPBench").style.display = "block";
                                        document.getElementById("divMPBench").value = val.Bench.trim();
                                        if (document.getElementById("divMPBench").value == "") {
                                            document.getElementById("divMPBench").value = "";
                                        }
                                        $("#divMPBench").change();
                                    }
                                    if (lvcourt == 'UP') {
                                        document.getElementById('divUP').style.display = "block";
                                        document.getElementById('divUPBench').style.display = "block";
                                        document.getElementById("divUPBench").value = val.Bench.trim();
                                        if (document.getElementById("divUPBench").value == "") {
                                            document.getElementById("divUPBench").value = "";
                                        }
                                        $("#divUPBench").change();
                                    }
                                    if (lvcourt == 'GH') {
                                        document.getElementById('divGH').style.display = "block";
                                        document.getElementById('divGHBench').style.display = "block";
                                        document.getElementById("divGHBench").value = val.Bench.trim();
                                        if (document.getElementById("divGHBench").value == "") {
                                            document.getElementById("divGHBench").value = "";
                                        }
                                        $("#divGHBench").change();
                                    }
                                    if (lvcourt == 'BH') {
                                        document.getElementById("divBH").style.display = "block";
                                        document.getElementById("divBHBench").style.display = "block";
                                        document.getElementById("divBHBench").value = val.Bench.trim();
                                        if (document.getElementById("divBHBench").value == "") {
                                            document.getElementById("divBHBench").value = "";
                                        }
                                        $("#divBHBench").change();
                                    }
                                    if (lvcourt == 'WB') {
                                        document.getElementById('divWB').style.display = "block";
                                        document.getElementById('divWBBench').style.display = "block";
                                        document.getElementById("divWBBench").value = val.Bench.trim();
                                        if (document.getElementById("divWBBench").value == "") {
                                            document.getElementById("divWBBench").value = "";
                                        }
                                        $("#divWBBench").change();
                                    }
                                    setTimeout(function () {
                                        $("#drptype").val(val.CaseType.trim());
                                        $("#txtno").val(val.Caseno.trim());
                                        $("#drpYear").val(val.CaseYear.trim());
                                    }, 5000);
                                }, 2000);
                            }
                            if (partycourttype == "2") {
                                $("#divSCHCDistrict").val(4).change();
                                setTimeout(function () {
                                    $("#drpcourtname").val(val.Court.trim()).change();
                                }, 2000);
                                setTimeout(function () {
                                    $("#drpNCBench").val(val.Bench.trim()).change();
                                    if ($("#drpcourtname").val() == "AL" || $("#drpcourtname").val() == "AFT") {
                                        $("#drptype option").each(function () {
                                            if ($(this).text() == val.CaseType.trim()) {
                                                $(this).attr('selected', 'selected');
                                            }
                                        });
                                    }
                                    else {
                                        setTimeout(function () {
                                            $('#drptype option[value="' + val.CaseType.trim() + '"]').prop("selected", true);
                                        }, 3000);
                                    }
                                    $("#txtno").val(val.Caseno.trim());
                                    $("#drpYear").val(val.CaseYear.trim());
                                    setTimeout(function () {
                                        $("#drpncdrcstate").val(val.vState.trim()).change();
                                        setTimeout(function () {
                                            $("#drpncdrcDistrict").val(val.District.trim()).change();
                                        }, 2000);
                                    }, 3000);
                                }, 5000);
                            }
                            if (partycourttype == "3") {
                                $("#divSCHCDistrict").val(3).change();
                                setTimeout(function () {
                                    $("#drpcourtnameDC").val(val.Court).change();
                                    setTimeout(function () {
                                        $("#drpdistrictcourtname").val(val.District.trim()).change();
                                        setTimeout(function () {
                                            $("#drpcourtcomplexestb").val(val.CompEstbType.trim()).change();
                                            setTimeout(function () {
                                                $("#drpcompestbcourt").val(val.CompEastbCourtId.trim()).change();
                                                var isnum = Number.isInteger(val.CaseType);
                                                setTimeout(function () {
                                                    if (isnum === false) {
                                                        var resfrstdata = val.CaseType.trim().split(")");
                                                        var sptdata = resfrstdata[1];
                                                        $("#drptype option[data-type='" + sptdata.trim() + "']").attr("selected", "selected");
                                                    }
                                                    else {
                                                        $("#drptype").val(val.CaseType.trim());
                                                    }
                                                    $("#txtno").val(val.Caseno.trim());
                                                    $("#drpYear").val($.trim(val.CaseYear));
                                                }, 3000);
                                            }, 2000);
                                        }, 2000);
                                    }, 2000);
                                }, 2000);
                            }
                            setTimeout(function () {
                                $("#casewatchmodel").modal({ show: true });
                                closeload();
                            }, 8000);
                        });
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
        return false;
    });
    $(document).on('click', '#getdetails', function () {
        var ids = $(this).attr("data-id");
        var courtype = $(this).attr("data-court");
        var html3 = '';
        var formData = new FormData();
        formData.append("Courttype", courtype);
        formData.append("Id", ids);
        $('#myModal23').modal({ show: true });
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/PartyNameDetailsbyAppealNo",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                if (length > 0) {
                    $("#divState option").remove();
                    html3 += ''
                    $.each(response1, function (i, val) {
                        html3 += '<tr>'
                        html3 += '<td>Appellant/Respondent:<td>'
                        html3 += '<td width:30px;>&nbsp;<td>'
                        html3 += '<td> '
                        html3 += val.Appres
                        html3 += '</td>'
                        html3 += '</tr>'
                        html3 += '<tr>'
                        html3 += '<td>Appeal No:<td>'
                        html3 += '<td width:30px;>&nbsp;<td>'
                        html3 += '<td> '
                        html3 += val.AppealNo
                        html3 += '</td>'
                        html3 += '</tr>'
                        html3 += '<tr>'
                        html3 += '<td>Court:<td>'
                        html3 += '<td width:30px;>&nbsp;<td>'
                        html3 += '<td> '
                        html3 += val.Court
                        html3 += '</td>'
                        html3 += '</tr>'
                        html3 += '<tr>'
                        html3 += '<td>Case Name:<td>'
                        html3 += '<td width:30px;>&nbsp;<td>'
                        html3 += '<td> '
                        html3 += val.Filetext
                        html3 += '</td>'
                        html3 += '</tr>'
                    });
                    $("#bindappeal").html("").html(html3);
                }
                $("#divState").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    });
    /*Get search by party name*/
    function GetSearchByPartyName() {
        var courttype = 1;
        var crtid = "";
        var stateid = "";
        var districtid = "";
        var searchtext = "";
        var rtype = $("#hdnRadioType").val();
        if (rtype == "2") {
            var divSCHC = $("#divSCHC").val();
            if (divSCHC == "SC") {
                courttype = "1";
                crtid = "SC";
                searchtext = $("#txtApplent").val();
            }
            else {
                courttype = "1";
                crtid = $("#divSCHC").val();
                searchtext = $("#txtApplent").val();
            }
        }
        if (rtype == "3") {
            courttype = "3";
            stateid = $("#divState").val();
            districtid = $("#districtid").val();
            searchtext = $("#txtApplent").val();
        }
        if (rtype == "4") {
            courttype = "2";
            crtid = $("#divSCHC").val();
            searchtext = $("#txtApplent").val();
        }
        var html3 = '';
        html3 += '<table id="example" style="overflow-x:auto;" class="table table-bordered table-striped">'
        html3 += '<thead>'
        if (rtype == "3") {
            html3 += '<tr >'
            html3 += '<th width="20%"><div class="thbg">Appeal No</div></th>'
            html3 += '<th width="60%"><div class="thbg">Case Info</div></th>'
            html3 += '<th width="10%"><div class="thbg">District</div></th>'
            html3 += '<th width="10%"><div class="thbg">Action</div></th>'
            html3 += '</tr>'
        }
        else {
            html3 += '<tr >'
            html3 += '<th width="20%"><div class="thbg">Appeal No</div></th>'
            html3 += '<th width="60%"><div class="thbg">Case Info</div></th>'
            html3 += '<th width="10%"><div class="thbg">Court</div></th>'
            html3 += '<th width="10%"><div class="thbg">Action</div></th>'
            html3 += '</tr>'
        }
        html3 += '</thead>'
        html3 += '<tbody>'
        var formData = new FormData();
        formData.append("courttype", courttype);
        formData.append("Courtid", crtid);
        formData.append("stateid", stateid);
        formData.append("districtid", districtid);
        formData.append("Searchtext", searchtext);
        formData.append("Pageindex", pageindex);
        formData.append("Pagesize", pagesize);
        openload();
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/GetSearchByPartyName",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                if (length > 0) {
                    $("#divsearchbypartyname tr").remove();
                    $.each(response1, function (i, val) {
                        if (i === (length - 1)) {
                            var tfot = '';
                            tfot += '<ul>'
                            var cpgindex = pageindex;
                            cpgindex = parseInt(pageindex) - 1;
                            var cpgindexnext = parseInt(pageindex) + 1;
                            if (pageindex > 1) {
                                tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + cpgindex + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a>'
                            }
                            if (length == pagesize) {
                                tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + cpgindexnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                            }
                            tfot += '</ul>'
                            $("#ptfooter").html("");
                            $("#ptfooter").html(tfot);
                        }
                        var vdoc = "", dtype = "";
                        if (rtype == "3") {
                            html3 += '<tr>'
                            html3 += '<td> '
                            html3 += "<a href='javascript:void()' id='getdetails' data-id='" + val.Id + "' data-court='" + courttype + "'>" + val.AppealNo + "</a>"
                            html3 += '</td>'
                            html3 += '<td>'
                            html3 += val.Appres
                            html3 += '</td>'
                            html3 += '<td>' + val.DistrictName
                            html3 += '</td>'
                            html3 += '<td> '
                            html3 += '<button class="sbtbtn" id="Addbyparty" data-id="' + val.Id + '" data-court="' + courttype + '">Add</button>'
                            html3 += '</td>'
                            html3 += '</tr>'
                        }
                        else {
                            html3 += '<tr>'
                            html3 += '<td> '
                            html3 += "<a href='javascript:void()' id='getdetails' data-id='" + val.Id + "' data-court='" + courttype + "'>" + val.AppealNo + "</a>"
                            html3 += '</td>'
                            html3 += '<td>'
                            html3 += val.Appres
                            html3 += '</td>'
                            html3 += '<td>' + val.CourtName
                            html3 += '</td>'
                            html3 += '<td> '
                            html3 += '<button class="sbtbtn" id="Addbyparty" data-id="' + val.Id + '" data-court="' + courttype + '">Add</button>'
                            html3 += '</td>'
                            html3 += '</tr>'
                        }
                    });
                } else {
                    html3 += '<tr>'
                    html3 += '<td colspan=4 align=center>Data Not Found</td></tr>'
                }
                html3 += '</tbody>'
                html3 += '</table>'
                $("#divsearchbypartyname").html("");
                $("#divsearchbypartyname").append(html3);
                closeload();
            },
            failure: function (response1) {
                alert(response1.responseText);
                closeload();
            },
            error: function (response1) {
                response1(data.responseText);
                closeload();
            }
        });
    }
    $("#rdSC").click(function () {
        pageindex = 1;
        document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "block";
        document.getElementById("div_State").style.display = "none";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("dr_pdistrictcourtname").style.display = "none";
        document.getElementById("hdnRadioType").value = "2";
        document.getElementById("divSearch").style.display = "block";
        GetSCHCTCCourt(2);
    });
    $("#rdDC").click(function () {
        pageindex = 1;
        document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "none";
        document.getElementById("div_State").style.display = "block";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("dr_pdistrictcourtname").style.display = "none";
        document.getElementById("hdnRadioType").value = "3";
        document.getElementById("divSearch").style.display = "block";
        GetDistrictCourt(3);
    });
    $("#rdTC").click(function () {
        pageindex = 1;
        document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "block";
        document.getElementById("div_State").style.display = "none";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("dr_pdistrictcourtname").style.display = "none";
        document.getElementById("hdnRadioType").value = "4";
        document.getElementById("divSearch").style.display = "block";
        GetSCHCTCCourt(4);
    });
    $("#divState").change(function () {
        var rad = document.getElementById("hdnRadioType").value;
        if (rad == "3") {
            document.getElementById("div_District").style.display = "block";
            if ($(this).val() == "0") {
                document.getElementById("div_District").style.display = "none";
                document.getElementById("districtid").value = "";
            }
            else {
                GetDistrict($(this).val());
            }
        }
        else {
            document.getElementById("div_District").style.display = "none";
            document.getElementById("districtid").value = "";
        }
    });
    /*Get district court details*/
    function GetDistrictCourt(courttype) {
        var html3 = '';
        var formData = new FormData();
        formData.append("Courttype", courttype);
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/GetCourt",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                if (length > 0) {
                    $("#divState option").remove();
                    html3 += '<option value="0" selected="selected">ALL</option>'
                    $.each(response1, function (i, a) {
                        var court_bench = a.CourtId;
                        html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                    });
                }
                $("#divState").append(html3);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
/*Get district court by court type*/
    function GetDistrict(courttype) {
        var html3 = '';
        $("#districtid").empty();
        $.ajax({
            type: "POST",
            url: "/AddCase/AddDistrictByCourt?courttype=" + courttype,
            dataType: "json",
            success: function (data) {
                $("#districtid").append("<option value=''>Please Select District</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#districtid").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
/*Get suprem court high court detail by court type*/
    function GetSCHCTCCourt(courttype) {
        var html3 = '';
        var formData = new FormData();
        formData.append("Courttype", courttype);
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/GetCourt",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                var length = response1.length;
                if (length > 0) {
                    $("#divSCHC option").remove();
                    html3 += '<option value="0" selected="selected">ALL</option>'
                    if (courttype == "2") {
                        html3 += '<option value="SC">SUPREME COURT</option>'
                    }
                    if (String(courttype) == "4") {
                        $.each(response1, function (i, a) {
                            var court_bench = a.CourtId;
                            if (court_bench == "IT" || court_bench == "CF" || court_bench == "AL" || court_bench == "AFT" || court_bench == "CI") {
                                html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                            }
                        });
                    }
                    else {
                        $.each(response1, function (i, a) {
                            var court_bench = a.CourtId;
                            html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                        });
                    }
                }
                $("#divSCHC").append(html3);
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