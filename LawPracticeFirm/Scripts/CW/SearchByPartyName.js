$(document).ready(function () {
    var pageindex = 1, pagesize = 50, recordcount = 0, totrecord = 0;
    var fcode = localStorage.getItem("FirmCode");
    var fcode = localStorage.getItem("FirmCode");
    if (stfUser > 0) {
        $('#mattersforlink212').prop("readonly", true);

    }
    else {
        $('#mattersforlink212').prop("readonly", false);

    }
    GetSCHCTCCourt(1);
    jQuery('#addtaskmember5').multiselect({
        columns: 1,
        //placeholder: 'Select Mattertyt',
        search: true,
        selectAll: false
    });
    /*Get date time*/
    function getDateTime() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (month.toString().length == 1) {
            month = '0' + month;
        }
        if (day.toString().length == 1) {
            day = '0' + day;
        }
        if (hour.toString().length == 1) {
            hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            second = '0' + second;
        }
        var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        return dateTime;
    }
    /*Get search by party name data by page number*/
    $(document).on('click', '#getdatabypagenum', function () {
        ppageindex = $("#pagnumvalue").val();
        if (ppageindex != "undefined") {
            if (Math.sign(ppageindex) == 1) {
                var ppageindesx = $("#sotopage").text();
                if (ppageindex <= parseInt(ppageindesx)) {
                    openload();
                    GetSearchByPartyName(1);
                    //closeload();
                }
                else {
                    alert("Please enter a valid page number.");
                    closeload();
                    return false;
                }
            }
        }
    });
    /*Pagiinate*/
    var chksflag = true;
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        GetSearchByPartyName(pageindex);
    });
    $("#btnSearch").click(function () {
        var txtApplent = $("#txtApplent").val();
        if (txtApplent == "") {
            alert("Enter Party Name");
            return false;
        }
        //var txtdivcourt = $("#divState").val();
        //if (txtdivcourt == null) {
        //    alert("Please Select Court.");
        //    return false;
        //}
        resetcasewatch();
        GetSearchByPartyName(1);
    });
    /*Remove case filter by search by party name*/
    $("#removecasefiler").change(function () {
        //alert("search");
        searchtext = $("#txtApplent").val();
        if (searchtext == "") {
            alert("Please enter search text");
            $("#txtApplent").focus();
            return false;
        }
        GetSearchByPartyName(1);
    });
    /*Add party*/
    $(document).on('click', '#Addbyparty', function () {
     
        /* your code here */
        $('#labelcaseNo').contents().first()[0].textContent = 'Matter Number';
        document.getElementById('divcasetype').style.display = "block";
        document.getElementById('drpyearShow').style.display = "block";
        var ids = $(this).attr("data-id");
        var courtype = $(this).attr("data-court");
        var caseinfo = $(this).attr("data-info");
        var caseYear = "";
        $("#caseinfo").val(caseinfo);
        var partsearchid = ids;
        var partycourttype = courtype;
        var checkCourt = $('input[name="rdcourt"]:checked').attr("id");
         

        localStorage.setItem("partsearchid", partsearchid);
        localStorage.setItem("partycourttype", partycourttype);
        var partsearchi = localStorage.getItem("partsearchid");
        var partycourttype = localStorage.getItem("partycourttype");
        var formData = new FormData();
        if (courtype == "3") {
            var couertid = $('#divState').val();
            formData.append("crtid", couertid);
            formData.append("caseYear", $('#searchByPartyNameCaseYear').val());
        }
        //else if (courtype =="3") {
        //    formData.append("crtid", couertid);

            //}
        else if (courtype == "5") {
            formData.append("crtid", "RERH");
        }
        else {
            var couertid = $('#divSCHC').val();
            formData.append("crtid", couertid);
        }      
        formData.append("Courttype", courtype);
        formData.append("Id", ids);
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
                        if (val.AppealNo && val.AppealNo.includes("Diary No")) {
                            $('#divSCDECD').empty();
                            FillCasetypeDiary();
                            setTimeout(function () {
                                $("#divSCDECD option").each(function () {
                                    if ($(this).text().trim().toLowerCase() === "diary") {
                                        $(this).prop("selected", true);
                                        $("#divSCDECD").trigger("change");
                                    }
                                    $('#txtDiaryNo').val(val.Caseno);
                                });
                            }, 500);
                        }
                        if (partycourttype == "1" && val.Court == "SC") {
                            $("#divSCHCDistrict").val(1).change();
                            setTimeout(function () {
                                $("#drptype").val(val.CaseType.trim());
                                $("#txtno").val(val.Caseno.trim());
                                $("#drpYear").val(val.CaseYear.trim());
                                //Added New Fields for CaseName
                                $("#LtCaseName").val(val.Appres.trim());
                                $("#mattersforlink212").val(val.Appres.trim());
                                $('#mattersforlink212').attr('title', val.Appres);
                            }, 5000);
                        }
                        if (partycourttype == "2" && val.Court == "MH") {
                            $("#divSCHCDistrict").val(2).change();
                            if (val.Bench == "Goa") {
                                document.getElementById('divMHGoaBench').style.display = "none";

                            } else {
                                document.getElementById('divMHGoaBench').style.display = "block";
                            }
                            setTimeout(function () {
                                $("#drpcourtname").val(val.Court.trim()).change();
                            }, 2000);
                            setTimeout(function () {
                                setTimeout(function () {
                                    $("#drpbench").val(val.Bench.trim()).change();
                                }, 2000);
                                setTimeout(function () {
                                    $("#drpside").val(val.vDocumentType.trim()).change();
                                }, 4000);
                                if (val.vStampReg != null || val.vStampReg != undefined) {
                                    $("#drpstampregister").val(val.vStampReg.trim());
                                }
                                /*$("#drpstampregister").val(val.vStampReg.trim());*/
                                setTimeout(function () {
                                    $("#drptype").val(val.CaseType.trim());
                                }, 2000);
                               
                                $("#txtno").val(val.Caseno.trim());
                                $("#drpYear").val(val.CaseYear.trim());
                                //Added New Fields for CaseName
                                $("#LtCaseName").val(val.Appres.trim());
                                $("#mattersforlink212").val(val.Appres.trim());
                                $('#mattersforlink212').attr('title', val.Appres);
                            }, 5000);
                        }
                        if (partycourttype == "2" && val.Court != "SC") {
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
                                    setTimeout(function () {
                                        $("#divTNBench").val(val.Bench.trim()).change();
                                    }, 2000);
                                }
                                if (lvcourt == 'RH') {
                                    document.getElementById('divRH').style.display = "block";
                                    document.getElementById('divRHBench').style.display = "block";
                                    document.getElementById("divRHBench").value = val.Bench.trim();
                                    if (document.getElementById("divRHBench").value == "") {
                                        document.getElementById("divRHBench").value = "";
                                    }
                                    if (val.Bench == "NULL") {
                                        val.Bench = "";
                                    }
                                    setTimeout(function () {
                                        $("#divRHBench").val(val.Bench.trim()).change();
                                    }, 2000);
                                }
                                if (lvcourt == 'JK') {
                                    document.getElementById('divJK').style.display = "block";
                                    document.getElementById('divJKBench').style.display = "block";
                                    document.getElementById("divJKBench").value = val.Bench.trim();
                                    if (document.getElementById("divJKBench").value == "") {
                                        document.getElementById("divJKBench").value = "";
                                    }
                                    if (val.Bench == "NULL") {
                                        val.Bench = "";
                                    }
                                    setTimeout(function () {
                                        $("#divJKBench").val(val.Bench.trim()).change();
                                    }, 2000);
                                }
                                if (lvcourt == 'MP') {
                                    document.getElementById("divMP").style.display = "block";
                                    document.getElementById("divMPBench").style.display = "block";
                                    document.getElementById("divMPBench").value = val.Bench.trim();
                                    if (document.getElementById("divMPBench").value == "") {
                                        document.getElementById("divMPBench").value = "";
                                    }
                                    if (val.Bench == "NULL") {
                                        val.Bench = "";
                                    }
                                    setTimeout(function () {
                                        $("#divMPBench").val(val.Bench.trim()).change();
                                    }, 2000);
                                }
                                if (lvcourt == 'UP') {
                                    document.getElementById('divUP').style.display = "block";
                                    document.getElementById('divUPBench').style.display = "block";
                                    document.getElementById("divUPBench").value = val.Bench.trim();
                                    if (document.getElementById("divUPBench").value == "") {
                                        document.getElementById("divUPBench").value = "";
                                    }
                                    if (val.Bench == "NULL") {
                                        val.Bench = "";
                                    }
                                    setTimeout(function () {
                                        $("#divUPBench").val(val.Bench.trim()).change();
                                    }, 2000);
                                }
                                if (lvcourt == 'GH') {
                                    document.getElementById('divGH').style.display = "block";
                                    document.getElementById('divGHBench').style.display = "block";
                                    document.getElementById("divGHBench").value = val.Bench.trim();
                                    if (document.getElementById("divGHBench").value == "") {
                                        document.getElementById("divGHBench").value = "";
                                    }
                                    if (val.Bench == "NULL") {
                                        val.Bench = "";
                                    }
                                    setTimeout(function () {
                                        $("#divGHBench").val(val.Bench.trim()).change();
                                    }, 2000);
                                }
                                if (lvcourt == 'BH') {
                                    document.getElementById("divBH").style.display = "block";
                                    document.getElementById("divBHBench").style.display = "block";
                                    document.getElementById("divBHBench").value = val.Bench.trim();
                                    if (document.getElementById("divBHBench").value == "") {
                                        document.getElementById("divBHBench").value = "";
                                    }
                                    if (val.Bench == "NULL") {
                                        val.Bench = "";
                                    }
                                    setTimeout(function () {
                                        $("#divBHBench").val(val.Bench.trim()).change();
                                    }, 2000);
                                }
                                if (lvcourt == 'WB') {
                                    document.getElementById('divWB').style.display = "block";
                                    document.getElementById('divWBBench').style.display = "block";
                                    document.getElementById("divWBBench").value = val.Bench.trim();
                                    if (document.getElementById("divWBBench").value == "") {
                                        document.getElementById("divWBBench").value = "";
                                    }
                                    if (val.Bench == "NULL") {
                                        val.Bench = "";
                                    }
                                    setTimeout(function () {
                                        $("#divWBBench").val(val.Bench.trim()).change();
                                    }, 2000);
                                }
                                setTimeout(function () {
                                    setTimeout(function () {
                                        // $("#drptype").val(val.Bench.trim()).change();
                                        $("#drptype").val(val.CaseType.trim()).change();
                                    }, 3000);
                                    $("#txtno").val(val.Caseno.trim());
                                    $("#drpYear").val(val.CaseYear.trim());
                                    //Added New Fields for CaseName
                                    $("#LtCaseName").val(val.Appres.trim());
                                    $("#mattersforlink212").val(val.Appres.trim());
                                    $('#mattersforlink212').attr('title', val.Appres);
                                }, 5000);
                            }, 2000);
                        }
                        //if (partycourttype == "2") {
                        //    $("#divSCHCDistrict").val(2).change();
                        //    setTimeout(function () {
                        //        $("#drpcourtname").val(val.Court.trim()).change();
                        //    }, 2000);
                        //    setTimeout(function () {
                        //        $("#drpNCBench").val(val.Bench.trim()).change();
                        //        if ($("#drpcourtname").val() == "AL" || $("#drpcourtname").val() == "AFT") {
                        //            setTimeout(function () {
                        //            $("#drptype option").each(function () {
                        //                if ($(this).text() == val.CaseType.trim()) {
                        //                    $(this).attr('selected', 'selected');
                        //                }
                        //                });
                        //            }, 3000);
                        //        }
                        //        else {
                        //            setTimeout(function () {
                        //                $('#drptype option[value="' + val.CaseType.trim() + '"]').prop("selected", true);
                        //            }, 3000);
                        //        }
                        //        $("#txtno").val(val.Caseno.trim());
                        //        $("#drpYear").val(val.CaseYear.trim());
                        //        //Added New Fields for CaseName
                        //        $("#LtCaseName").val(val.Appres.trim());
                        //        $("#mattersforlink212").val(val.Appres.trim());
                        //        $('#mattersforlink212').attr('title', val.Appres);
                        //        setTimeout(function () {
                        //            $("#drpncdrcstate").val(val.vState.trim()).change();
                        //            setTimeout(function () {
                        //                $("#drpncdrcDistrict").val(val.District.trim()).change();
                        //            }, 2000);
                        //        }, 3000);
                        //    }, 5000);
                        //}
                        if (partycourttype == "4") {
                       
                            $('#labelcaseNo').contents().first()[0].textContent = 'Matter Number';
                            $("#divSCHCDistrict").val(4).change();
                            setTimeout(function () {
                                $("#drpcourtname").val(val.Court.trim()).change();
                            }, 2000);
                            var Rcbench = "";
                            setTimeout(function () {
                                if (val.Court.trim() == "RC") {
                                    if (val.Bench.trim() != "") {
                                        Rcbench = val.Bench.replace("#", "@$!");
                                        $("#drpNCBench").val(Rcbench).change();
                                    }
                                } else {
                                    $("#drpNCBench").val(val.Bench.trim()).change();
                                }
                               
                                if ($("#drpcourtname").val() == "AL" || $("#drpcourtname").val() == "AFT") {
                                    setTimeout(function () {
                                        $("#drptype option").each(function () {
                                            if ($(this).text() == val.CaseType.trim()) {
                                                $(this).attr('selected', 'selected');
                                            }
                                        });
                                    }, 3000);
                                }
                                else {
                                    setTimeout(function () {
                                        if (val.Court.trim() == "RC") {
                                            if (val.CaseType.trim() != "") {
                                                var caeetyoee = val.CaseType.replace("#", "@$!");
                                                $('#drptype option[value="' + caeetyoee + '"]').prop("selected", true);
                                            }
                                        }
                                        else {
                                            //For DRT Diary Number Case Type handle
                                            if (val.Court == "DT" && val.CaseType == "DN") {
                                                $("#divcasetype_DT").hide();
                                                $("#drptype_DN").val(val.CaseType);
                                                $("#divDTcasetypeDiary").show();
                                            }
                                            else {
                                                $("#divcasetype_DT").show();
                                                $("#divDTcasetypeDiary").hide();
                                                $('#drptype option[value="' + val.CaseType.trim() + '"]').prop("selected", true);
                                            }

                                        }
                                     
                                    }, 3000);
                                }

                                if (val.Court.trim() == "CF") {
                                    $('#labelcaseNo').contents().first()[0].textContent = 'Appeal Number';
                                    document.getElementById('divcasetype').style.display = "none";
                                    document.getElementById('drpyearShow').style.display = "none";
                                    $("#txtno").val(val.AppealNo.trim());
                                }
                                else {
                                    $('#labelcaseNo').contents().first()[0].textContent = 'Matter Number';
                                    document.getElementById('divcasetype').style.display = "block";
                                    document.getElementById('drpyearShow').style.display = "block";
                                    $("#txtno").val(val.Caseno.trim());
                                }

                                setTimeout(function () {
                                    $('#drptype option[value="' + val.CaseType.trim() + '"]').prop("selected", true);
                                }, 3000);
                               // $("#txtno").val(val.Caseno.trim());
                                $("#drpYear").val(val.CaseYear.trim());
                                //Added New Fields for CaseName
                                $("#LtCaseName").val(val.Appres.trim());
                                $("#mattersforlink212").val(val.Appres.trim());
                                $('#mattersforlink212').attr('title', val.Appres);
                                setTimeout(function () {
                                    $("#drpncdrcstate").val(val.vState.trim()).change();
                                    setTimeout(function () {
                                        $("#drpncdrcDistrict").val(val.District.trim()).change();
                                    }, 2000);
                                }, 3000);
                            },



                                5000);
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
                                                //if (isnum === false) {
                                                //    var resfrstdata = val.CaseType.trim().split(")");
                                                //     // var sptdata = resfrstdata[1];
                                                //     var sptdata = resfrstdata[0];
                                                //    $("#drptype option[data-type='" + sptdata.trim() + "']").attr("selected", "selected");
                                                //}
                                                //else {
                                                //    $("#drptype").val(val.CaseType.trim());
                                                //}
                                                $("#drptype").val(val.CaseType.trim());
                                                $("#txtno").val(val.Caseno.trim());
                                                $("#drpYear").val($.trim(val.CaseYear));
                                                $("#drpdcourtcnr").val($.trim(val.CNRNo));
                                                //Added New Fields for CaseName
                                                $("#LtCaseName").val(val.Appres.trim());
                                                $("#mattersforlink212").val(val.Appres.trim());
                                                $('#mattersforlink212').attr('title', val.Appres);
                                            }, 3000);
                                        }, 2000);
                                    }, 2000);
                                }, 2000);
                            }, 2000);
                        }

                        //if (partycourttype == "5") {
                        //    $("#divSCHCDistrict").val(6).change();

                        //    setTimeout(function () {
                        //        $("#RevenueCourt").val(val.vcourt).change();

                        //        setTimeout(function () {
                        //            $("#RevenueJanpad").val(val.District_name).change();

                        //            setTimeout(function () {
                        //                $("#RevenueCourtName").val(val.Court_name).change();

                        //                var appealNo = val.AppealNo || "";
                        //                var caseYear = appealNo.split("/")[0];

                        //               // $("#Revenuetxtno").val(val.Caseno);
                        //                $("#RevenueYear").val(val.caseYear);

                        //                $("#LtCaseName").val(val.Appres.trim());
                        //                $("#mattersforlink212").val(val.Appres.trim());
                        //                $("#mattersforlink212").attr("title", val.Appres);
                        //            }, 2000);
                        //        }, 2000);
                        //    }, 2000);
                        //}
                        //if (partycourttype == "5") {
                        //    $("#divSCHCDistrict").val(6).change();

                        //    setTimeout(function () {
                        //        // This will select Rajasthan / RERH if dropdown option value is RERH
                        //        $("#RevenueCourt").val(val.Court).change();


                        //        var appealNo = val.AppealNo || "";
                        //        var caseYear = appealNo.split("/")[0];

                        //        $("#RevenueRefNo").val(appealNo);   // full 2023/240
                        //        $("#RevenueYear").val(caseYear)
                        //        $("#RevenueDistrictName").val(val.District_name || "");
                        //        $("#RevenueCourtTypeText").val(val.Court_type || "");

                        //        $("#RevenueCourtName").val(val.Court_name).change();
                        //        $("#RevenueCourtNameText").val($("#RevenueCourtName option:selected").text().trim());
                        //        $("#RevenuePurpose").val(val.Purpose || "");

                        //        $("#LtCaseName").val((val.Appres || "").trim());
                        //        $("#mattersforlink212").val((val.Appres || "").trim());
                        //        $("#mattersforlink212").attr("title", val.Appres || "");

                        //        $("#casewatchmodel").modal({ show: true });
                        //        closeload();
                        //    }, 3000);
                        //}
                        if (partycourttype == "5") {
                            $("#divSCHCDistrict").val(6).change();

                            setTimeout(function () {
                                $("#RevenueCourt").val(val.Court || "").change();

                                var appealNo = val.AppealNo || "";

                                $("#RevenueRefNo").val(appealNo);
                                $("#RevenueDistrictName").val(val.District_name || "");
                                $("#RevenueCourtTypeText").val(val.Court_type || "");
                                $("#RevenueCourtNameText").val(val.Court_name || "");
                                $("#RevenuePurpose").val(val.Purpose || "");

                                $("#LtCaseName").val((val.Appres || "").trim());
                                $("#mattersforlink212").val((val.Appres || "").trim());
                                $("#mattersforlink212").attr("title", val.Appres || "");

                                $("#casewatchmodel").modal({ show: true });
                                closeload();
                            }, 3000);
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
        return false;
    });
    /*Save case details*/
    $("#savecase").click(function () {

        if ($("#drpdcourtcnr").val() == "") {
            if (document.getElementById('divSCHCDistrict').value == '1') {
                document.getElementById('drpcourtname').value = "SC";
            }
            if (document.getElementById('divSCHCDistrict').value == '1' || document.getElementById('divSCHCDistrict').value == '2' || document.getElementById('divSCHCDistrict').value == '4') {
                //document.getElementById('drpbench').style.border = "unset";
                //document.getElementById('drpside').style.border = "unset";
                //document.getElementById('divTNBench').style.border = "unset";
                //document.getElementById('divJKBench').style.border = "unset";
                //document.getElementById('divRHBench').style.border = "unset";
                //document.getElementById('divBHBench').style.border = "unset";
                //document.getElementById('divMPBench').style.border = "unset";
                //document.getElementById('divUPBench').style.border = "unset";
                //document.getElementById('divGHBench').style.border = "unset";
                //document.getElementById('drpNCBench').style.border = "unset";
                //document.getElementById('drptype').style.border = "unset";
                //document.getElementById('txtno').style.border = "unset";
                //document.getElementById('txtDiaryNo').style.border = "unset";
                //document.getElementById('txtno').style.border = "unset";
                //document.getElementById('drpYear').style.border = "unset";
                //document.getElementById('drpcourtnameDC').style.border = "unset";
                //document.getElementById('drpcourtcomplexestb').style.border = "unset";
                //document.getElementById('drpcompestbcourt').style.border = "unset";
                //document.getElementById('drptype').style.border = "unset";
                //document.getElementById('txtno').style.border = "unset";
                //document.getElementById('drpYear').style.border = "unset";
                if (document.getElementById('drpcourtname').value != "0") {
                    if (document.getElementById('drpcourtname').value == "MH") {

                        if (document.getElementById('drpGoa').value != "Goa") {
                            if (document.getElementById('drpbench').value == "Select Bench" || document.getElementById('drpbench').value == "" || document.getElementById('drpbench').value == "0") {
                                alert("please select bench");
                                document.getElementById('drpbench').focus();
                                document.getElementById('drpbench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                            if (document.getElementById('drpbench').value != "Goa") {
                                if (document.getElementById('drpside').value == "" || document.getElementById('drpside').value == "Select Side" || document.getElementById('drpside').value == "0") {
                                    alert("please select side");
                                    document.getElementById('drpside').focus();
                                    document.getElementById('drpside').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname').value == "TN") {
                        if (document.getElementById('divTNBench').value == "") {
                            if (document.getElementById('divTNBench').value == "Select Bench" || document.getElementById('divTNBench').value == "" || document.getElementById('divTNBench').value == "0") {
                                alert("please select bench");
                                document.getElementById('divTNBench').focus();
                                document.getElementById('divTNBench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname').value == "JK") {
                        if (document.getElementById('divJKBench').value == "Select Bench" || document.getElementById('divJKBench').value == "") {
                            alert("please select bench");
                            document.getElementById('divJKBench').focus();
                            document.getElementById('divJKBench').style.border = "1px solid red";
                            $('#casewatchmodel').modal('show');
                            return false;
                        }
                    }
                    if (document.getElementById('drpcourtname').value == "RH") {
                        if (document.getElementById('divRHBench').value == "") {
                            if (document.getElementById('divRHBench').value == "Select Bench" || document.getElementById('divRHBench').value == "") {
                                alert("please select bench");
                                document.getElementById('divRHBench').focus();
                                document.getElementById('divRHBench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname').value == "BH") {
                        if (document.getElementById('divBHBench').value == "") {
                            if (document.getElementById('divBHBench').value == "Select Bench" || document.getElementById('divBHBench').value == "" || document.getElementById('divBHBench').value == "0") {
                                alert("please select type");
                                document.getElementById('divBHBench').focus();
                                document.getElementById('divBHBench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname').value == "MP") {
                        if (document.getElementById('divMPBench').value == "") {
                            if (document.getElementById('divMPBench').value == "Select Bench" || document.getElementById('divMPBench').value == "" || document.getElementById('divMPBench').value == "0") {
                                alert("please select type");
                                document.getElementById('divMPBench').focus();
                                document.getElementById('divMPBench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname').value == "UP") {
                        if (document.getElementById('divUPBench').value == "") {
                            if (document.getElementById('divUPBench').value == "Select Bench" || document.getElementById('divUPBench').value == "") {
                                alert("please select bench");
                                document.getElementById('divUPBench').focus();
                                document.getElementById('divUPBench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname').value == "GH") {
                        if (document.getElementById('divGHBench').value == "") {
                            if (document.getElementById('divGHBench').value == "Select Bench" || document.getElementById('divGHBench').value == "") {
                                alert("please select bench");
                                document.getElementById('divGHBench').focus();
                                document.getElementById('divGHBench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname').value != "") {
                        if (document.getElementById('drpcourtname').value == "NC" || document.getElementById('drpcourtname').value == "NL" || document.getElementById('drpcourtname').value == "DT" || document.getElementById('drpcourtname').value == "CF"
                            || document.getElementById('drpcourtname').value == "NGT" || document.getElementById('drpcourtname').value == "CT" || document.getElementById('drpcourtname').value == "CI" || document.getElementById('drpcourtname').value == "RC") {
                            if (document.getElementById('drpNCBench').value == "Select Bench" || document.getElementById('drpNCBench').value == "0") {
                                alert("please select bench");
                                document.getElementById('drpNCBench').focus();
                                document.getElementById('drpNCBench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                            if (document.getElementById('drpNCBench').value == "C" || document.getElementById('drpNCBench').value == "E") {
                                if (document.getElementById('drpncdrcstate').value == "0") {
                                    alert("please Select the state.");
                                    document.getElementById('drpncdrcstate').focus();
                                    document.getElementById('drpncdrcstate').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                                if (document.getElementById('drpNCBench').value == "E") {
                                    if (document.getElementById('drpncdrcDistrict').value == "0") {
                                        alert("please select district forum");
                                        document.getElementById('drpncdrcDistrict').focus();
                                        document.getElementById('drpncdrcDistrict').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname').value == "IT" || document.getElementById('drpcourtname').value == "CE") {
                            if (document.getElementById('drpNCBench').value == "Select Bench" || document.getElementById('drpNCBench').value == "0") {
                                alert("please select bench");
                                document.getElementById('drpNCBench').focus();
                                document.getElementById('drpNCBench').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
           
                        if (document.getElementById('drpcourtname').value != "NC" || document.getElementById('drpcourtname').value != "NL" || document.getElementById('drpcourtname').value == "DT") {
                            if (document.getElementById('drpcourtname').value != "SC" && document.getElementById('drpcourtname').value != "OERC" && document.getElementById('drpcourtname').value != "CF" ) {
                                if (document.getElementById('drptype').value == "Select Matter Type" || document.getElementById('drptype').value == "0") {
                                    if (document.getElementById('drptype_DN').value == "Select Matter Type" || document.getElementById('drptype_DN').value == "0") {
                                        alert("please select matter type");
                                        document.getElementById('drptype').focus();
                                        document.getElementById('drptype').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                    else {
                                       
                                    }
                                }
                            }
                            else {
                                if (document.getElementById('divSCDECD').value == "0") {
                                    if (document.getElementById('drptype').value == "Select matter type" || document.getElementById('drptype').value == "0") {
                                        alert("please select matter type");
                                        document.getElementById('drptype').focus();
                                        document.getElementById('drptype').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                    if (document.getElementById('txtno').value == "") {
                                        alert("please enter matter no.");
                                        document.getElementById('txtno').focus();
                                        document.getElementById('txtno').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                    if (document.getElementById('drpcourtname').value != "NC" && document.getElementById('drpcourtname').value != "NL") {
                                        if (document.getElementById('txtno').value != "") {
                                            if (/\//.test(document.getElementById('txtno').value)) {
                                                alert("/ not allowed in matter no");
                                                document.getElementById('txtno').focus();
                                                document.getElementById('txtno').style.border = "1px solid red";
                                                $('#casewatchmodel').modal('show');
                                                return false;
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (document.getElementById('drpcourtname').value != "OERC" && document.getElementById('drpcourtname').value != "CF") {
                                        if (document.getElementById('txtDiaryNo').value == "") {
                                            alert("please enter diary no.");
                                            document.getElementById('txtDiaryNo').focus();
                                            document.getElementById('txtDiaryNo').style.border = "1px solid red";
                                            $('#casewatchmodel').modal('show');
                                            return false;
                                        }
                                    }

                                }
                            }
                        }
                        if (document.getElementById('drpcourtname').value != "SC") {
                            if (document.getElementById('txtno').value == "") {
                                if (document.getElementById('divTCDT').value == "1" && document.getElementById('drpcourtname').value == "DT") {
                                    if (document.getElementById('txtDiaryNo').value == "") {
                                        alert("please enter diary no.");
                                        document.getElementById('txtDiaryNo').focus();
                                        return false;
                                    }
                                }
                                else if (document.getElementById('drpcourtname').value == "CF") {
                                    alert("please enter Appeal no.");
                                    document.getElementById('txtno').focus();
                                    document.getElementById('txtno').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                                else {
                                    alert("please enter matter no.");
                                    document.getElementById('txtno').focus();
                                    document.getElementById('txtno').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                            }
                            if (document.getElementById('drpcourtname').value != "NC" && document.getElementById('drpcourtname').value != "NL") {
                                if (document.getElementById('drpcourtname').value == "CF") {

                                }
                                else {
                                    if (document.getElementById('txtno').value != "") {
                                        if (/\//.test(document.getElementById('txtno').value)) {
                                            alert("/ not allowed in matter no");
                                            document.getElementById('txtno').focus();
                                            document.getElementById('txtno').style.border = "1px solid red";
                                            $('#casewatchmodel').modal('show');
                                            return false;
                                        }
                                    }
                                }
                        
                            }
                        }
                        if (document.getElementById('drpcourtname').value == "CF") {

                        }
                        else {
                            if (document.getElementById('drpYear').value == "" || document.getElementById('drpYear').value == "0") {
                                alert("please select matter year");
                                document.getElementById('drpYear').focus();
                                document.getElementById('drpYear').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                        
                    }
                }
            }
            else if (document.getElementById('divSCHCDistrict').value == '3') {
                //document.getElementById('drpbench').style.border = "unset";
                //document.getElementById('drpside').style.border = "unset";
                //document.getElementById('divTNBench').style.border = "unset";
                //document.getElementById('divJKBench').style.border = "unset";
                //document.getElementById('divRHBench').style.border = "unset";
                //document.getElementById('divBHBench').style.border = "unset";
                //document.getElementById('divMPBench').style.border = "unset";
                //document.getElementById('divUPBench').style.border = "unset";
                //document.getElementById('divGHBench').style.border = "unset";
                //document.getElementById('drpNCBench').style.border = "unset";
                //document.getElementById('drptype').style.border = "unset";
                //document.getElementById('txtDiaryNo').style.border = "unset";
                //document.getElementById('txtno').style.border = "unset";
                //document.getElementById('drpYear').style.border = "unset";
                //document.getElementById('drpcourtnameDC').style.border = "unset";
                //document.getElementById('drpcourtcomplexestb').style.border = "unset";
                //document.getElementById('drpcompestbcourt').style.border = "unset";
                //document.getElementById('drptype').style.border = "unset";
                //document.getElementById('txtno').style.border = "unset";
                //document.getElementById('drpYear').style.border = "unset";
                if (document.getElementById('drpcourtnameDC').value == "") {
                    alert("please Select the state.");
                    document.getElementById('drpcourtnameDC').focus();
                    document.getElementById('drpcourtnameDC').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpdistrictcourtname').value == "0") {
                    alert("please select district");
                    document.getElementById('drpdistrictcourtname').focus();
                    document.getElementById('drpdistrictcourtname').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpcourtcomplexestb').value == "") {
                    alert("please select court complex / court establishment");
                    document.getElementById('drpcourtcomplexestb').focus();
                    document.getElementById('drpcourtcomplexestb').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpcompestbcourt').value == "") {
                    alert("please select district court");
                    document.getElementById('drpcompestbcourt').focus();
                    document.getElementById('drpcompestbcourt').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drptype').value == "") {
                    alert("please select matter type");
                    document.getElementById('drptype').focus();
                    document.getElementById('drptype').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('txtno').value == "") {
                    alert("please enter matter no.");
                    document.getElementById('txtno').focus();
                    document.getElementById('txtno').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpcourtname').value != "NC" && document.getElementById('drpcourtname').value != "NL") {
                    if (document.getElementById('txtno').value != "") {
                        if (/\//.test(document.getElementById('txtno').value)) {
                            alert("/ not allowed in matter no");
                            document.getElementById('txtno').focus();
                            document.getElementById('txtno').style.border = "1px solid red";
                            $('#casewatchmodel').modal('show');
                            return false;
                        }
                    }
                }
                if (document.getElementById('drpYear').value == "0") {
                    alert("please select matter year");
                    document.getElementById('drpYear').focus();
                    document.getElementById('drpYear').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
            }
            //using custom court
            else if (document.getElementById('divSCHCDistrict').value == '5') {
                if (document.getElementById('txtno').value == "") {
                    alert("please enter case no.");
                    document.getElementById('txtno').focus();
                    document.getElementById('txtno').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpYear').value == "0") {
                    alert("please select case year");
                    document.getElementById('drpYear').focus();
                    document.getElementById('drpYear').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('txtcasename').value == "") {
                    alert("please enter case name");
                    document.getElementById('txtcasename').focus();
                    document.getElementById('txtcasename').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('dtnhearingdate').value == "") {
                    alert("please select next hearing date");
                    document.getElementById('dtnhearingdate').focus();
                    document.getElementById('dtnhearingdate').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
            }
            //end
            else if (document.getElementById('divSCHCDistrict').value == '6') {
                //if ($("#RevenueRefNo").val() != "" && document.getElementById('RevenueCourt').value != "") {
                //    alert("Please select only one Revenue court or Computerized Case No. ");
                //    document.getElementById('RevenueCourt').focus();
                //    document.getElementById('RevenueCourt').style.border = "1px solid red";
                //    $('#casewatchmodel').modal('show');
                //    return false;
                //}
                if ($("#RevenueRefNo").val() != "") {
                }
                else {
                    if (document.getElementById('RevenueCourt').value == "") {
                        alert("please select revenue court");
                        document.getElementById('RevenueCourt').focus();
                        document.getElementById('RevenueCourt').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueMandal').value == "0") {
                        alert("please select revenue mandal");
                        document.getElementById('RevenueMandal').focus();
                        document.getElementById('RevenueMandal').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueJanpad').value == "") {
                        alert("please enter revenue janpad");
                        document.getElementById('RevenueJanpad').focus();
                        document.getElementById('RevenueJanpad').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueTahsil').value == "") {
                        alert("please select revenue tahsil");
                        document.getElementById('RevenueTahsil').focus();
                        document.getElementById('RevenueTahsil').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueCourtName').value == "") {
                        alert("please select revenue court name");
                        document.getElementById('RevenueCourtName').focus();
                        document.getElementById('RevenueCourtName').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueCourtNameText').value == "") {
                        alert("please select revenue court name");
                        document.getElementById('RevenueCourtNameText').focus();
                        document.getElementById('RevenueCourtNameText').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenuePurpose').value == "") {
                        alert("please select revenue purpose");
                        document.getElementById('RevenuePurpose').focus();
                        document.getElementById('RevenuePurpose').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueCourtTypeText').value == "") {
                        alert("please select revenue court type");
                        document.getElementById('RevenueCourtTypeText').focus();
                        document.getElementById('RevenueCourtTypeText').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueDistrictName').value == "") {
                        alert("please select district name");
                        document.getElementById('RevenueDistrictName').focus();
                        document.getElementById('RevenueDistrictName').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('Revenuetxtno').value == "") {
                        alert("please select case no.");
                        document.getElementById('Revenuetxtno').focus();
                        document.getElementById('Revenuetxtno').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueYear').value == "0") {
                        alert("please select case year");
                        document.getElementById('RevenueYear').focus();
                        document.getElementById('RevenueYear').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueYear').value == "") {
                        alert("please select case year");
                        document.getElementById('RevenueYear').focus();
                        document.getElementById('RevenueYear').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                }
            }
            else {
            }
        }
        else {
            if (document.getElementById('divSCHCDistrict').value == '2' || document.getElementById('divSCHCDistrict').value == '3') {
            }
            else {
                alert("Please select District Court or High Court For CNR");
                $('#casewatchmodel').modal('show');
                return false;
            }
        }
        var mattersforlink21 = $("#mattersforlink212").val();
        //Add clomun for case Name
        var litigationcasename = $("#LtCaseName").val();
        if (mattersforlink21 == "") {
            alert("Please enter the matter name.");
            document.getElementById("mattersforlink212").focus();
            return false;
        } else {
            //var litigationcasenameer = mattersforlink21.substr(0, 100);
            //var casensss = litigationcasenameer.replace(/[^\w\s]/gi, '');
            //mattersforlink21 = casensss;
            //or
            //mattersforlink21 = mattersforlink21.trim().substring(0, 100);
            //or
            mattersforlink21 = mattersforlink21
                .trim()
                .substring(0, 100)
                .replace(/[<>"]/g, '');
        }
        var opendate = new Date().toISOString().split('T')[0];
        var divSCHCDistrict = $("#divSCHCDistrict").val();
        if (divSCHCDistrict == "") {
            alert("Select Court Type");
            return false;
        }
        var addtaskmember5 = $("#addtaskmember5").val();
        var confirmPassword = "";
        var casecasetype = "42";
        var usertype1 = "";
        var formData = new FormData();
        if ($("#divSCHCDistrict").val() == "6") {
            formData.append("drpcourtname", EncodeText("RevenueCourt"));
        }
        else if ($("#divSCHCDistrict").val() == "7") {
            formData.append("drpcourtname", EncodeText("ReraCourt"));
        }
        else {
            formData.append("drpcourtname", EncodeText($("#drpcourtname").val()));
        }
        //For DRT Case Type Handle
        var drpdnType = $("#drptype_DN").val();
        if (drpdnType == "DN") {
            formData.append("drptype", drpdnType);
            formData.append("txtDiaryNo", $("#txtno").val());
            formData.append("txtno", "");
        }
        else {
            formData.append("drptype", $("#drptype").val());
            formData.append("txtDiaryNo", $("#txtDiaryNo").val());
            formData.append("txtno", $("#txtno").val());
        }
        //formData.append("txtno", $("#txtno").val());
        //formData.append("drptype", $("#drptype").val());
        formData.append("drpYear", $("#drpYear").val());
        formData.append("txtFileNo", '');
        formData.append("drpKAbench", $("#drpKAbench").val());
        formData.append("drpGoa", $("#drpGoa").val());
        formData.append("drpbench", $("#drpbench").val());
        formData.append("drpside", $("#drpside").val());
        formData.append("drpstampregister", $("#drpstampregister").val());
        formData.append("drpNCBench", $("#drpNCBench").val());
        formData.append("divTNBench", $("#divTNBench").val());
        formData.append("divRHBench", $("#divRHBench").val());
        formData.append("divJKBench", $("#divJKBench").val());
        formData.append("divBHBench", $("#divBHBench").val());
        formData.append("divMPBench", $("#divMPBench").val());
        formData.append("divUPBench", $("#divUPBench").val());
        formData.append("divGHBench", $("#divGHBench").val());
        formData.append("divWBBench", $("#divWBBench").val());
        formData.append("casedetails", "");

        formData.append("divSCHCDistrict", $("#divSCHCDistrict").val());
        formData.append("drpcourtnameDC", $("#drpcourtnameDC").val());
        formData.append("drpdistrictcourtname", $("#drpdistrictcourtname").val());
        formData.append("drpcourtcomplexestb", $("#drpcourtcomplexestb").val());
        formData.append("drpcompestbcourt", $("#drpcompestbcourt").val());
        formData.append("drpncdrcstate", $("#drpncdrcstate").val());
        formData.append("drpncdrcDistrict", $("#drpncdrcDistrict").val());
        formData.append("mattersforlink21", EncodeText(mattersforlink21));
        formData.append("confirmPassword", "");
        formData.append('txtsuffix', document.getElementById('txtsuffix').value);
        //Add New Fields
        var mattertpetet = $("#drptype option:selected").text();
        var othercourttxt = $("#drpcourtname option:selected").text();
        if (othercourttxt == "-Select Court Name-") {
            othercourttxt = "";
        }
        var districtothercourt = $("#drpcompestbcourt option:selected").text();
        var districtcourtsatate = $("#drpcourtnameDC option:selected").text();
        var districtcourtdistrict = $("#drpdistrictcourtname option:selected").text();
        if (districtcourtdistrict == "Select Your State / UT") {
            districtcourtdistrict = "";
        }
        formData.append("mattertypetext", EncodeText(mattertpetet));
        formData.append("othercourttxt", EncodeText(othercourttxt));
        formData.append("districtothercourt", EncodeText(districtothercourt));
        formData.append("districtcourtsatate", EncodeText(districtcourtsatate));
        formData.append("districtcourtdistrict", EncodeText(districtcourtdistrict));
        //start revenue Court
        //if (document.getElementById('RevenueRefNo').value == "") {
        //    formData.append('RevenueCourt', EncodeText(document.getElementById('RevenueCourt').value));
        //    formData.append('RevenueMandal', EncodeText(document.getElementById('RevenueMandal').value));
        //    formData.append('RevenueJanpad', EncodeText(document.getElementById('RevenueJanpad').value));
        //    formData.append('RevenueTahsil', EncodeText(document.getElementById('RevenueTahsil').value));
        //    formData.append('RevenueCourtName', EncodeText(document.getElementById('RevenueCourtName').value));
        //    formData.append('RevenueCourtNameText', EncodeText(document.getElementById('RevenueCourtNameText').value));
        //    formData.append('RevenuePurpose', EncodeText(document.getElementById('RevenuePurpose').value));
        //    formData.append('RevenueCourtTypeText', EncodeText(document.getElementById('RevenueCourtTypeText').value));
        //    formData.append('RevenueDistrictName', EncodeText(document.getElementById('RevenueDistrictName').value));
        //    formData.append('Revenuetxtno', EncodeText(document.getElementById('Revenuetxtno').value));
        //    formData.append('RevenueYear', EncodeText(document.getElementById('RevenueYear').value));
        //    formData.append('RevenueRefNo', "");
        //}
        //else {
        //    formData.append('RevenueCourt', "");
        //    formData.append('RevenueMandal', "");
        //    formData.append('RevenueJanpad', "");
        //    formData.append('RevenueTahsil', "");
        //    formData.append('RevenueCourtName', "");
        //    formData.append('RevenueCourtNameText', "");
        //    formData.append('RevenuePurpose', "");
        //    formData.append('RevenueCourtTypeText', "");
        //    formData.append('RevenueDistrictName', "");
        //    formData.append('Revenuetxtno', "");
        //    formData.append('RevenueYear', "");
        //    formData.append('RevenueRefNo', EncodeText(document.getElementById('RevenueRefNo').value));
        //}
        //End revenue Court
        //start revenue Court
        if ($("#divSCHCDistrict").val() == "6") {
            formData.append('RevenueCourt', EncodeText($("#RevenueCourt").val() || ""));
            formData.append('RevenueRefNo', EncodeText($("#RevenueRefNo").val() || ""));
            formData.append('RevenueDistrictName', EncodeText($("#RevenueDistrictName").val() || ""));
            formData.append('RevenueCourtTypeText', EncodeText($("#RevenueCourtTypeText").val() || ""));
            formData.append('RevenueCourtNameText', EncodeText($("#RevenueCourtNameText").val() || ""));
            formData.append('RevenuePurpose', EncodeText($("#RevenuePurpose").val() || ""));

            formData.append('RevenueMandal', "");
            formData.append('RevenueJanpad', "");
            formData.append('RevenueTahsil', "");
            formData.append('RevenueCourtName', "");
            formData.append('Revenuetxtno', "");
            formData.append('RevenueYear', "");
        }
        else {
            formData.append('RevenueCourt', "");
            formData.append('RevenueRefNo', "");
            formData.append('RevenueDistrictName', "");
            formData.append('RevenueCourtTypeText', "");
            formData.append('RevenueCourtNameText', "");
            formData.append('RevenuePurpose', "");

            formData.append('RevenueMandal', "");
            formData.append('RevenueJanpad', "");
            formData.append('RevenueTahsil', "");
            formData.append('RevenueCourtName', "");
            formData.append('Revenuetxtno', "");
            formData.append('RevenueYear', "");
        }
        //End revenue Court
        //Start Rera Court
        if ($("#divSCHCDistrict").val() == "7") {
            formData.append('ReraCourt', EncodeText(document.getElementById('divReraCourt').value));
            formData.append('reracasetype', EncodeText(document.getElementById('reracasetype').value));
            formData.append('reracasno', EncodeText(document.getElementById('reracasno').value));
            formData.append('reracaseyear', EncodeText(document.getElementById('reracaseyear').value));
            formData.append('reraRefNo', EncodeText(document.getElementById('reraRefNo').value));
        }
        else {
            formData.append('ReraCourt', "");
            formData.append('reracasetype', "");
            formData.append('reracasno', "");
            formData.append('reracaseyear', "");
            formData.append('reraRefNo', "");
        }
        var ditrictidname = "";
        try {
            ditrictidname = $("#drpdistrictcourtname option:selected").text();
            formData.append("drpdistrictcourtfullname", ditrictidname);
        }
        catch (er) {
            formData.append("drpdistrictcourtfullname", ditrictidname);
        }
        var drpdcourtcnr = $("#drpdcourtcnr").val();
        if (drpdcourtcnr != "") {
            var isValid = false;
            var regex = /^[a-zA-Z0-9]*$/;
            isValid = regex.test(drpdcourtcnr);
            if (isValid == false) {
                alert("District CNR No. should be Alphanumeric Only.");
                document.getElementById('drpdcourtcnr').focus();
                document.getElementById('drpdcourtcnr').style.border = "1px solid red";
                $('#casewatchmodel').modal('show');
                return false;
            }
            if (drpdcourtcnr.length < 16 || drpdcourtcnr.length < 16) {
                alert("District CNR No. should be equal to 16 digits.");
                document.getElementById('drpdcourtcnr').focus();
                document.getElementById('drpdcourtcnr').style.border = "1px solid red";
                $('#casewatchmodel').modal('show');
                return false;
            }
        }
        formData.append("drpdcourtcnr1", EncodeText(drpdcourtcnr));
        var caseinfo = $("#caseinfo").val();
        formData.append("caseinfo", caseinfo);
        var matterids = $("#livecaseidhide").val();
        formData.append("matterid", matterids);
        formData.append("usertypes", EncodeText(usertype1));
        formData.append("txtcasename", EncodeText($("#txtcasename").val()));
        formData.append("dtnhearingdate", EncodeText($("#dtnhearingdate").val()));
        formData.append("txtcustomadvocate", EncodeText($("#txtcustomadvocate").val()));
        formData.append("txtcustomstatus", EncodeText($("#txtcustomstatus").val()));
        formData.append("assignuser", EncodeText(addtaskmember5));
        formData.append("checkclient", EncodeText(checkclient));
        formData.append("confirmPassword", EncodeText(confirmPassword));
        formData.append("casecasetype", EncodeText(casecasetype));
        formData.append("odate", EncodeText(opendate));
        openload();
        $.ajax(
            {
                type: "POST",
               // url: "/api/MatterApi/DirectAddCaseToCW", // Controller/View
                url: "/api/MatterApi/AddCaseLiveUpdateToCW",
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Data == "Sorry! Unable to Add now.") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Sorry! Unable to Add Matter.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "Cannot find table 0.") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Already Exists Email in casewatch, please update your mail to add case',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "Already Exists User Please Try Another User Name!") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'User ID is already exists. Please Try Another User ID !',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "livecaselimitexceed") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Youi have exceeded limit to add Case live update from e-Courts.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "livecaselimitnotfound") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Please subscribe for Case live update from e-Courts.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "livecasenotactive") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Please subscribe for Case live update from e-Courts.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "livecaseaccessdenied") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'You are not authorized to access add case for live update from e-Courts',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else if (data.Data == "Already exist matter name. please try another matter name") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Matter name already exists. Please try new name.',
                            type: 'error',
                            delay: 3000
                        });
                        closeload();
                    }
                    else {
                        if (data.Data == "false") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'This matter is already exists.',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "Case Detail Already Exists!!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Matter detail already exists!',
                                type: 'error',
                                delay: 3000
                            });
                            closeload();
                        }
                        else if (data.Data == "success") {
                            $("#closecasemodal").click();
                            new PNotify({
                                title: 'Success!',
                                text: ' case saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            closeload();
                            resetcasewatch();
                            //For Removing case from List if case added sucessfully
                            //$('#removecasefiler').prop('checked', true);
                            //GetSearchByPartyName(1);
                            var fcode5 = localStorage.getItem("FirmCode");
                            //if (hsmklitigation == "display:unset" && dashmatter == "display:unset") {
                            //    window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                            //}
                            //else if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                            //    window.location = encodeURI("/" + fcode5 + "/CW/LitigationCaseList");
                            //}
                            //else {
                            //    window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                            //}
                        }
                        else {
                            if (data.Data == 'Exist') {
                                alert("Matter detail already exist.");
                            }
                            //alert(data.Data);
                            closeload();
                        }
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
    })
    $(document).on('click', '#getdetails', function () {
    
        document.getElementById('pdatastatus').style.display = 'none';
        var ids = $(this).attr("data-id");
        var courtype = $(this).attr("data-court");
        var html3 = '';
        var formData = new FormData();
        var checkCourt = $('input[name="rdcourt"]:checked').attr("id");
        if (courtype == "3") {
            formData.append("crtid", $('#divState').val());
        }
        //else if (courtype == "3") {
        //    formData.append("crtid", $('#divState').val());

            //}
        else if (courtype == "5") {
            formData.append("crtid", "RERH");
        }
        else {
            formData.append("crtid", $('#divSCHC').val());
        }        formData.append("Courttype", courtype);
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
                  //  $("#divState option").remove();
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
                        html3 += val.CourtName
                        html3 += '</td>'
                        html3 += '</tr>'
                        html3 += '<tr>'
                        html3 += '<td>Case Name:<td>'
                        html3 += '<td width:30px;>&nbsp;<td>'
                        html3 += '<td> '
                        html3 += val.Filetext
                        html3 += '</td>'
                        html3 += '</tr>'
                        html3 += '<tr>'
                        html3 += '<td>Bench:</td>'
                        html3 += '<td width="30px;">&nbsp;</td><td></td><td></td>'
                        html3 += '<td>'
                        html3 += val.Bench
                        html3 += '</td>'
                        html3 += '</tr>'
                    });
                    $("#bindappeal").html("").html(html3);
                }
                else {
                    document.getElementById('pdatastatus').style.display = 'block';
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
    /*Start Revenue Court*/
    function GetSearchByPartyName(pageindexx) {
        var courttype = 1;
        var crtid = "";
        var stateid = "";
        var districtid = "";
        var searchtext = "";
        var rtype = $("#hdnRadioType").val();
        if (rtype == "1") {
            var divSCHC = $("#divSCHC").val();
            if (divSCHC == "") {
                alert("Please Select Court");
                return false;
            }
            courttype = "1";
            crtid = $("#divSCHC").val();
            searchtext = $("#txtApplent").val();
        }
        if (rtype == "2") {
            var divSCHC = $("#divSCHC").val();
            if (divSCHC == "") {
                alert("Please Select Court");
                return false;
            }
            if (divSCHC == "SC") {
                courttype = "1";
                crtid = "SC";
                searchtext = $("#txtApplent").val();
            }
            else {
                courttype = "2";
                crtid = $("#divSCHC").val();
                searchtext = $("#txtApplent").val();
            }
        }
        if (rtype == "3") {
            courttype = "3";
            stateid = $("#divState").val();
            districtid = $("#districtid").val();
            if (districtid == null) {
                alert("Please Select Court");
                return false;
            }
            searchtext = $("#txtApplent").val();
        }
        if (rtype == "4") {
            var divSCHC = $("#divSCHC").val();
            if (divSCHC == "") {
                alert("Please Select Court");
                return false;
            }
            courttype = "4";
            crtid = $("#divSCHC").val();
            searchtext = $("#txtApplent").val();
        }
        if (rtype == "5") {
            courttype = "5";
            stateid = $("#divState").val();

            crtid = "RERH";
            districtid = "";
            searchtext = $("#txtApplent").val();
        }
        var html3 = '';
        html3 += '<table id="example" class="table-panel">'
        html3 += '<thead>'
        if (rtype == "3") {
            html3 += '<tr >'
            html3 += '<th width="15%"><div class="thbg">Appeal No</div></th>';
            html3 += '<th width="40%"><div class="thbg">Case Info</div></th>';
            html3 += '<th width="15%"><div class="thbg">District</div></th>';
            html3 += '<th width="10%"><div class="thbg">CNRNo</div></th>';
            html3 += '<th width="10%"><div class="thbg">Bench</div></th>';
            html3 += '<th width="10%"><div class="thbg">Action</div></th>';
            html3 += '</tr>'
        }
        else {
            html3 += '<tr >'
            html3 += '<th width="15%"><div class="thbg">Appeal No</div></th>';
            html3 += '<th width="50%"><div class="thbg">Case Info</div></th>';
            html3 += '<th width="13%"><div class="thbg">Court</div></th>';
            html3 += '<th width="12%"><div class="thbg">Bench</div></th>';
            html3 += '<th width="10%"><div class="thbg">Action</div></th>';
            html3 += '</tr>'
        }
        html3 += '</thead>'
        html3 += '<tbody>'
        //courttype = rtype;
        var caseYear = $("#searchByPartyNameCaseYear").val();
        if (rtype == "3") {
            if (caseYear == "") {
                alert("Please Select Case Year");
                return false;
            }
        }
        var formData = new FormData();
        formData.append("courttype", courttype);
        formData.append("Courtid", crtid);
        formData.append("stateid", stateid);
        formData.append("districtid", districtid);
        formData.append("Searchtext", searchtext);
        formData.append("Pageindex", pageindexx);
        formData.append("Pagesize", pagesize);
        formData.append("caseYear", caseYear);
        var removecasefiler = $("#removecasefiler").is(":checked");
        formData.append("removecasefiler", removecasefiler);
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
                // Check for error responses
                if (response1 && typeof response1 === "object" && !Array.isArray(response1)) {
                    if (response1.Status === false || response1.Status === "False" || response1.Status === "false") {
                        showTimeoutPopup(response1.Message || "Search could not be completed. Please try again with a more specific party name.");
                        return;
                    }
                }
                // Check if response is a string error message
                if (typeof response1 === "string") {
                    showTimeoutPopup(response1);
                    return;
                }
                var length = response1.length;
                if (length > 0) {
                    $("#divsearchbypartyname tr").remove();
                    $.each(response1, function (i, val) {
                        if (i === (length - 1)) {
                            var tfot = '';
                            tfot += '<ul>'
                            var cpgindex = pageindexx;
                            cpgindex = parseInt(pageindexx) - 1;
                            var cpgindexnext = parseInt(pageindexx) + 1;
                            if (pageindexx > 1) {
                                //tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + cpgindex + '"><img src="/newassets/img/pre-arrow.png"> </a>'
                                tfot += '<li style="display: flex; gap: 5px;">';
                                tfot += '<div id="paginate" class="pagination-button-group-base" index="' + cpgindex + '" title="Previous Page" style="cursor: pointer;border: 1px solid lightgrey;border-radius: 7px;">';
                                tfot += '<img class="arrow-left-icon" alt="" src="/newassets/img/pre-arrow.png" style="width:16px; height:16px;">';
                                tfot += '<div class="text" style="float:right; padding:0 0 0 8px;">Previous</div>';
                                tfot += '</div>';
                            }
                            //tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + cpgindexnext + '"  ><img src="/newassets/img/next-arrow.png" style="padding:3px 0 0 0;"></a ></span ></li >'
                            if (length > 48) {
                                tfot += '<div id="paginate" class="pagination-button-group-base8" index="' + cpgindexnext + '" title="Next Page" style="cursor: pointer;border: 1px solid lightgrey;border-radius: 7px;">';
                                tfot += '<div class="text" style="float: left; padding: 0 8px 0 0;">Next</div>';
                                tfot += '<img style="float: right; width: 16px; height: 16px;" class="arrow-left-icon" alt="" src="/newassets/img/next-arrow.png" />';
                                tfot += '</div>';
                            }
                            tfot += '</li>';
                            tfot += '</ul>'
                            $("#ptfooter").html("");
                            $("#ptfooter").html(tfot);
                            // closeload();
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
                            html3 += '<td>' + val.CNRNo
                            html3 += '</td>'
                            html3 += '<td>' + (val.BenchName || '') + '</td>'
                            html3 += '<td> '
                            html3 += '<button class="courtlabel" id="Addbyparty" data-info="' + val.Appres + '" data-id="' + val.Id + '" data-court="' + courttype + '" style="font-size: 12px; background: #fff;text-transform: capitalize;border-radius: 20px;padding: 2px 8px;">+ Add</button>'
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
                            html3 += '<td><p class="courtlabel" style="font-size:12px;"><span style="padding:0 2px 0 0;"><img src="/newassets/img/bank.png" /></span>' + val.CourtName
                            html3 += '</p></td>'
                            html3 += '<td>' + (rtype == "5" ? "Rajasthan" : (val.BenchName || '')) + '</td>'
                            html3 += '<td> '
                            html3 += '<button class="courtlabel"  id="Addbyparty" data-info="' + val.Appres + '" data-id="' + val.Id + '" data-court="' + courttype + '" style="font-size: 12px; background: #fff;text-transform: capitalize;border-radius: 20px;padding: 2px 8px;">+ Add</button>'
                            html3 += '</td>'
                            html3 += '</tr>'
                        }
                    });
                } else {
                    closeload();
                    html3 += '<tr>'
                    html3 += '<td colspan=4 align=center>Data Not Found</td></tr>'
                }
                html3 += '</tbody>'
                html3 += '</table>'
                $("#divsearchbypartyname").html("");
                $("#divsearchbypartyname").append(html3);
                closeload();
            },
            timeout: 120000, // 120 seconds timeout on frontend
            error: function (xhr, status, errorThrown) {
                var errMsg = "Search could not be completed. Please try again with a more specific party name.";
                if (status === "timeout") {
                    errMsg = "Search could not be completed. Please try again with a more specific party name.";
                } else if (xhr.responseText) {
                    try {
                        var resp = JSON.parse(xhr.responseText);
                        if (resp.Message) {
                            errMsg = resp.Message;
                        } else if (resp.message) {
                            errMsg = resp.message;
                        }
                    } catch (e) {
                        if (xhr.responseText.indexOf("timed out") > -1 || xhr.responseText.indexOf("timeout") > -1) {
                            errMsg = "Search could not be completed. Please try again with a more specific party name.";
                        }
                    }
                }
                showTimeoutPopup(errMsg);
            }
        });
    }
    function showTimeoutPopup(message) {
        try { closeload(); } catch (e) { }
        // Remove any existing popup
        $("#searchErrorOverlay").remove();
        var popup = '<div id="searchErrorOverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;">'
            + '<div style="background:#fff;border-radius:12px;width:420px;max-width:92%;box-shadow:0 10px 40px rgba(0,0,0,0.35);overflow:hidden;text-align:center;">'
            + '<div style="background:#fef2f2;padding:25px 20px 15px 20px;">'
            + '<div style="width:60px;height:60px;margin:0 auto 12px;background:#fde8e8;border-radius:50%;display:flex;align-items:center;justify-content:center;">'
            + '<span style="color:#e74c3c;font-size:30px;line-height:1;">&#9888;</span>'
            + '</div>'
            + '<h3 style="margin:0 0 8px;color:#b91c1c;font-size:17px;font-weight:600;">Search Error</h3>'
            + '<p style="margin:0;color:#555;font-size:13.5px;line-height:1.5;">' + message + '</p>'
            + '</div>'
            + '<div style="padding:15px 20px 20px;">'
            + '<button onclick="document.getElementById(\'searchErrorOverlay\').remove();" style="background:#dc2626;color:#fff;border:none;padding:10px 50px;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background=\'#b91c1c\'" onmouseout="this.style.background=\'#dc2626\'">OK</button>'
            + '</div>'
            + '</div></div>';
        $("body").append(popup);
        // Clicking outside popup does nothing - must click OK
        $("#searchErrorOverlay").on("click", function (e) {
            if (e.target === this) { } // only OK button closes
        });
    }
        /*Get Supereme court Court*/
    $("#rdSC").click(function () {
        pageindex = 1;
        document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "block";
        document.getElementById("div_State").style.display = "none";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("hdnRadioType").value = "1";
        document.getElementById("divSearch").style.display = "block";
        document.getElementById("txtApplent").value = "";
        GetSCHCTCCourt(1);
    });
    /*Get SCHCTC Court*/
    $("#rdhigh").click(function () {
        pageindex = 1;
        document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "block";
        document.getElementById("div_State").style.display = "none";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("hdnRadioType").value = "2";
        document.getElementById("divSearch").style.display = "block";
        document.getElementById("txtApplent").value = "";
        GetSCHCTCCourt(2);
    });
    /*Get District Court*/
    $("#rdDC").click(function () {
        pageindex = 1;
        document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "none";
        document.getElementById("div_State").style.display = "block";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("hdnRadioType").value = "3";
        document.getElementById("divSearch").style.display = "block";
        document.getElementById("txtApplent").value = "";
        GetDistrictCourt(3);
    });
    /*Get SCHCTC Court*/
    $("#rdTC").click(function () {
        pageindex = 1;
        document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "block";
        document.getElementById("div_State").style.display = "none";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("hdnRadioType").value = "4";
        document.getElementById("divSearch").style.display = "block";
        document.getElementById("txtApplent").value = "";
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
  
/*Get District details*/
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
/*Get SCHCTC Court by court type*/
    function GetSCHCTCCourt(courttype) {
        var html3 = '';
        var html4 = '';
        var formData = new FormData();
        formData.append("Courttype", courttype);
        $('#myOverlaySearchByPartyName').modal('show');
        $.ajax({
            async: true,
            type: "POST",
            url: "/CW/GetCourt",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response1) {
                $('#myOverlay').hide();
                $('#myOverlaySearchByPartyName').hide();
                var length = response1.length;
                if (length > 0) {
                    $("#divSCHC option").remove();
                    if (courttype != "1") {
                        //html4 += '<option value="0" >ALL</option>'
                        html3 += '<option value="" selected="selected">Please Select</option>'
                    } else {
                       
                    }
                   
                    //if (courttype == "2") {
                      //  html3 += '<option value="SC">SUPREME COURT</option>'
                   // }
                    if (String(courttype) == "4") {
                        $.each(response1, function (i, a) {
                            var court_bench = a.CourtId;
                            if (court_bench != "ST") {
                                html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                            }
                        });
                    }
                    else {
                        $.each(response1, function (i, a) {
                            var court_bench = a.CourtId;
                            if (court_bench != "TL") {
                                html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                        }
                        });
                    }
                }
                $("#divSCHC").append(html3);
                $('#myOverlaySearchByPartyName').modal('hide');
                $('#myOverlay').hide();
                $('#myOverlaySearchByPartyName').hide();
               // $("#divSCHC").append(html4);
            },
            failure: function (data) {
                alert(data.responseText);
            },
            error: function (data) {
                alert(data.responseText);
            }
        });
    }
    CheckCourtType();
  
});
function CheckCourtType() {
    var CourtType = document.getElementById("courtTypes").value;
    if (CourtType == "1") {
        pageindex = 1;
        // document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "block";
        document.getElementById("div_State").style.display = "none";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("hdnRadioType").value = "1";
        document.getElementById("divSearch").style.display = "block";
        document.getElementById("txtApplent").value = "";
        $('#searchByPartyNameCaseYearDiv').hide();
        $('#searchByPartyNameCaseYear').hide();
        GetSCHCTCCourt1(1);
    }
    if (CourtType == "2") {
        pageindex = 1;
        // document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "block";
        document.getElementById("div_State").style.display = "none";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("hdnRadioType").value = "2";
        document.getElementById("divSearch").style.display = "block";
        document.getElementById("txtApplent").value = "";
        $('#searchByPartyNameCaseYearDiv').hide();
        $('#searchByPartyNameCaseYear').hide();
        GetSCHCTCCourt1(2);
    }
    if (CourtType == "3") {
        pageindex = 1;
        pageindex = 1;
        //document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "block";
        document.getElementById("div_State").style.display = "none";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("hdnRadioType").value = "4";
        document.getElementById("divSearch").style.display = "block";
        document.getElementById("txtApplent").value = "";
        $('#searchByPartyNameCaseYearDiv').hide();
        $('#searchByPartyNameCaseYear').hide();
        GetSCHCTCCourt1(4);
    }
    if (CourtType == "4") {
        pageindex = 1;
        //document.getElementById("divSearchCriteria").style.display = "block";
        document.getElementById("div_SCHC").style.display = "none";
        document.getElementById("div_State").style.display = "block";
        document.getElementById("div_District").style.display = "none";
        document.getElementById("districtid").value = "";
        document.getElementById("hdnRadioType").value = "3";
        document.getElementById("divSearch").style.display = "block";
        document.getElementById("txtApplent").value = "";
        $('#searchByPartyNameCaseYearDiv').show();
        $('#searchByPartyNameCaseYear').show();
        GetDistrictCourt(3);
    }
    if (CourtType == "5") {
        pageindex = 1;

        document.getElementById("div_SCHC").style.display = "none";
        document.getElementById("div_State").style.display = "block";
        document.getElementById("div_District").style.display = "none";

        document.getElementById("districtid").value = "";
        document.getElementById("hdnRadioType").value = "5";
        document.getElementById("divSearch").style.display = "block";
        document.getElementById("txtApplent").value = "";

        $("#divState option").remove();

        var html = '';
        html += '<option value="">Please Select</option>';
        html += '<option value="RJ" selected="selected">Rajasthan</option>';
        $('#searchByPartyNameCaseYearDiv').hide();
        $('#searchByPartyNameCaseYear').hide();
        $("#divState").append(html);
        GetSCHCTCCourt1(5);

    }
}

function GetSCHCTCCourt1(courttype) {
    var html3 = '';
    var html4 = '';
    var formData = new FormData();
    formData.append("Courttype", courttype);
    $('#myOverlaySearchByPartyName').modal('show');
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/GetCourt",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $('#myOverlay').hide();
            $('#myOverlaySearchByPartyName').hide();
            var length = response1.length;
            if (length > 0) {
                $("#divSCHC option").remove();
                if (courttype != "1") {
                    //html4 += '<option value="0" >ALL</option>'
                    html3 += '<option value="" selected="selected">Please Select</option>'
                } else {

                }

                //if (courttype == "2") {
                //  html3 += '<option value="SC">SUPREME COURT</option>'
                // }
                if (String(courttype) == "4") {
                    $.each(response1, function (i, a) {
                        var court_bench = a.CourtId;
                        if (court_bench != "ST") {
                            html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                        }
                    });
                }
                else {
                    $.each(response1, function (i, a) {
                        var court_bench = a.CourtId;
                        html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                        //if (court_bench != "HY") {
                        //    html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                        //}
                    });
                }
            }
            $("#divSCHC").append(html3);
            $('#myOverlaySearchByPartyName').modal('hide');
            // $("#divSCHC").append(html4);
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}


/*Get District Court*/
function GetDistrictCourt(courttype) {
    var html3 = '';
    var html5 = '';
    var formData = new FormData();
    formData.append("Courttype", courttype);
    $('#myOverlaySearchByPartyName').modal('show');
    $.ajax({
        async: true,
        type: "POST",
        url: "/CW/GetCourt",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            $('#myOverlay').hide();
            $('#myOverlaySearchByPartyName').hide();

            var length = response1.length;
            if (length > 0) {
                $("#divState option").remove();
                // html3 += '<option value="0">ALL</option>'
                html5 += '<option value="" selected="selected">Please Select</option>'
                $.each(response1, function (i, a) {
                    var court_bench = a.CourtId;
                    html3 += "<option value=" + a.CourtId + ">" + a.Courtname + "</option>"
                });
            }
            $("#divState").append(html3);
            $("#divState").append(html5);
            $('#myOverlaySearchByPartyName').modal('hide')
        },
        failure: function (data) {
            alert(data.responseText);
        },
        error: function (data) {
            alert(data.responseText);
        }
    });
}