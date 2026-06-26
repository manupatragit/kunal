$(document).ready(function () {
    /*Start multiple validations*/
    FillCourtType1();
/*Fill court type*/
    function FillCourtType1() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/Firm/FillCourt",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var option = '<option value="">--Select Court--</option>';
                $.each(response, function (i, a) {
                    option += '<option value="' + a["id"] + '" >  ' + a["courtname"] + '</option>';
                });
                option += '<option value="6" >Revenue Court</option>';
                option += '<option value="7" >RERA Court</option>';
                $("#divSCHCDistrict1").append(option);//End of foreach Loop
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
    $("#rdCriminal1").click(function () {
        $("#divmatteroption1").show();
    });
    $("#rdCivil1").click(function () {
        $("#divmatteroption1").hide();
        $("#matterpolicstation1").val("");
        $("#matterfirno1").val("");
    });
    $("#rdTaxation1").click(function () {
        $("#divmatteroption1").hide();
        $("#matterpolicstation1").val("");
        $("#matterfirno1").val("");
    });
    $("#rdAppeal").click(function () {
        $("#divcasetype1option1").show();
    });
    $("#rdApplication1").click(function () {
        $("#divcasetype1option1").show();
    });
    $("#rdOriginal1").click(function () {
        $("#divcasetypeoption1").hide();
        $("#CertifiedCopyAppliedon1").val("");
        $("#CertifiedCopyReceivedon1").val("");
    });
    //END
    var fcode = localStorage.getItem("FirmCode");
    /*For Add live update */
    $("#savecasemanual").click(function () {
        if (document.getElementById('divSCHCDistrict1').value == "7") {
            if (document.getElementById('divReraCourt1').value == "0") {
                alert("Please Select the Court Name");
                document.getElementById('divReraCourt1').focus();
                $('#casewatchmodel').modal('show');
                return false;
            }
            else if (document.getElementById('reracasetype1').value == "0" && document.getElementById('reracasetype1').value !== "UPRA") {
                alert("Please Select the Case/Appeal Authority");
                document.getElementById('reracasetype1').focus();
                $('#casewatchmodel').modal('show');
                return false;
            }
            else if (!document.getElementById('reracasno1').value) {
                alert("Please Enter the Case/Appeal No.");
                document.getElementById('reracasno1').focus();
                $('#casewatchmodel').modal('show');
                return false;
            }
            else if (document.getElementById('reracaseyear1').value == "0") {
                alert("Please Select Case Year");
                document.getElementById('reracaseyear1').focus();
                $('#casewatchmodel').modal('show');
                return false;
            } else;
        }
        var casename = $("#mattersforlink21").val();
        if (casename == "") {
            alert("Please enter the matter name.");
            return false;
        }
        if ($("#drpdcourtcnr1").val() == "") {
            if (document.getElementById('divSCHCDistrict1').value == '1') {
                document.getElementById('drpcourtname1').value = "SC";
            }
            if (document.getElementById('divSCHCDistrict1').value == '1' || document.getElementById('divSCHCDistrict1').value == '2' || document.getElementById('divSCHCDistrict1').value == '4') {
                document.getElementById('drpbench1').style.border = "unset";
                document.getElementById('drpside1').style.border = "unset";
                document.getElementById('divTNBench1').style.border = "unset";
                document.getElementById('divJKBench1').style.border = "unset";
                document.getElementById('divRHBench1').style.border = "unset";
                document.getElementById('divBHBench1').style.border = "unset";
                document.getElementById('divMPBench1').style.border = "unset";
                document.getElementById('divUPBench1').style.border = "unset";
                document.getElementById('divGHBench1').style.border = "unset";
                document.getElementById('divWBBench1').style.border = "unset";
                document.getElementById('drpNCBench1').style.border = "unset";
                document.getElementById('drptype1').style.border = "unset";
                document.getElementById('txtno1').style.border = "unset";
                document.getElementById('txtDiaryNo1').style.border = "unset";
                document.getElementById('txtno1').style.border = "unset";
                document.getElementById('drpYear1').style.border = "unset";
                document.getElementById('drpcourtnameDC1').style.border = "unset";
                document.getElementById('drpcourtcomplexestb1').style.border = "unset";
                document.getElementById('drpcompestbcourt1').style.border = "unset";
                document.getElementById('drptype1').style.border = "unset";
                document.getElementById('txtno1').style.border = "unset";
                document.getElementById('drpYear1').style.border = "unset";
                if (document.getElementById('drpcourtname1').value != "0") {
                    if (document.getElementById('drpcourtname1').value == "MH") {
                        if (document.getElementById('drpGoa1').value != "Goa") {
                            if (document.getElementById('drpbench1').value == "Select Bench" || document.getElementById('drpbench1').value == "" || document.getElementById('drpbench1').value == "0") {
                                alert("please select bench");
                                document.getElementById('drpbench1').focus();
                                document.getElementById('drpbench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                            if (document.getElementById('drpside1').value == "" || document.getElementById('drpside1').value == "Select Side" || document.getElementById('drpside1').value == "0") {
                                alert("please select side");
                                document.getElementById('drpside1').focus();
                                document.getElementById('drpside1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname1').value == "TN") {
                        if (document.getElementById('divTNBench1').value == "") {
                            if (document.getElementById('divTNBench1').value == "Select Bench" || document.getElementById('divTNBench1').value == "" || document.getElementById('divTNBench1').value == "0") {
                                alert("please select bench");
                                document.getElementById('divTNBench1').focus();
                                document.getElementById('divTNBench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname1').value == "JK") {
                        if (document.getElementById('divJKBench1').value == "Select Bench" || document.getElementById('divJKBench1').value == "") {
                            alert("please select bench");
                            document.getElementById('divJKBench1').focus();
                            document.getElementById('divJKBench1').style.border = "1px solid red";
                            $('#casewatchmodel').modal('show');
                            return false;
                        }
                    }
                    if (document.getElementById('drpcourtname1').value == "RH") {
                        if (document.getElementById('divRHBench1').value == "") {
                            if (document.getElementById('divRHBench1').value == "Select Bench" || document.getElementById('divRHBench1').value == "") {
                                alert("please select bench");
                                document.getElementById('divRHBench1').focus();
                                document.getElementById('divRHBench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname1').value == "BH") {
                        if (document.getElementById('divBHBench1').value == "") {
                            if (document.getElementById('divBHBench1').value == "Select Bench" || document.getElementById('divBHBench1').value == "" || document.getElementById('divBHBench1').value == "0") {
                                alert("please select type");
                                document.getElementById('divBHBench1').focus();
                                document.getElementById('divBHBench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname1').value == "MP") {
                        if (document.getElementById('divMPBench1').value == "") {
                            if (document.getElementById('divMPBench1').value == "Select Bench" || document.getElementById('divMPBench1').value == "" || document.getElementById('divMPBench1').value == "0") {
                                alert("please select type");
                                document.getElementById('divMPBench1').focus();
                                document.getElementById('divMPBench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname1').value == "UP") {
                        if (document.getElementById('divUPBench1').value == "") {
                            if (document.getElementById('divUPBench1').value == "Select Bench" || document.getElementById('divUPBench1').value == "") {
                                alert("please select bench");
                                document.getElementById('divUPBench1').focus();
                                document.getElementById('divUPBench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname1').value == "GH") {
                        if (document.getElementById('divGHBench1').value == "") {
                            if (document.getElementById('divGHBench1').value == "Select Bench" || document.getElementById('divGHBench1').value == "") {
                                alert("please select bench");
                                document.getElementById('divGHBench1').focus();
                                document.getElementById('divGHBench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname1').value == "WB") {
                        if (document.getElementById('divWBBench1').value == "") {
                            if (document.getElementById('divWBBench1').value == "Select Bench" || document.getElementById('divWBBench1').value == "") {
                                alert("please select bench");
                                document.getElementById('divWBBench1').focus();
                                document.getElementById('divWBBench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                    }
                    if (document.getElementById('drpcourtname1').value != "") {
                        if (document.getElementById('drpcourtname1').value == "NC" || document.getElementById('drpcourtname1').value == "NL" || document.getElementById('drpcourtname1').value == "DT" || document.getElementById('drpcourtname1').value == "CF"
                            || document.getElementById('drpcourtname1').value == "CT" || document.getElementById('drpcourtname1').value == "CI" || document.getElementById('drpcourtname1').value == "RC") {
                            if (document.getElementById('drpNCBench1').value == "Select Bench" || document.getElementById('drpNCBench1').value == "0") {
                                alert("please select bench");
                                document.getElementById('drpNCBench1').focus();
                                document.getElementById('drpNCBench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                            if (document.getElementById('drpNCBench1').value == "C" || document.getElementById('drpNCBench1').value == "E") {
                                if (document.getElementById('drpncdrcstate1').value == "0") {
                                    alert("please Select the state.");
                                    document.getElementById('drpncdrcstate1').focus();
                                    document.getElementById('drpncdrcstate1').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }
                                if (document.getElementById('drpNCBench1').value == "E") {
                                    if (document.getElementById('drpncdrcDistrict1').value == "0") {
                                        alert("please select district forum");
                                        document.getElementById('drpncdrcDistrict1').focus();
                                        document.getElementById('drpncdrcDistrict1').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname1').value == "IT" || document.getElementById('drpcourtname1').value == "CE") {
                            if (document.getElementById('drpNCBench1').value == "Select Bench" || document.getElementById('drpNCBench1').value == "0") {
                                alert("please select bench");
                                document.getElementById('drpNCBench1').focus();
                                document.getElementById('drpNCBench1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }
                        if (document.getElementById('drpcourtname1').value != "NC" || document.getElementById('drpcourtname1').value != "NL" || document.getElementById('drpcourtname1').value == "DT") {
                            if (document.getElementById('drpcourtname1').value != "SC") {
                                if (document.getElementById('drptype1').value == "Select Matter Type" || document.getElementById('drptype1').value == "0") {
                                    if (document.getElementById('divTCDT1').value == "1" && document.getElementById('drpcourtname1').value == "DT") {
                                        if (document.getElementById('txtDiaryNo1').value == "") {
                                            alert("please enter diary no.");
                                            document.getElementById('txtDiaryNo1').focus();
                                            return false;
                                        }
                                    }
                                    else if (document.getElementById('drpcourtname1').value == "OERC") {
                                    }
                                    else if (document.getElementById('drpcourtname1').value == "CF") {
                                        document.getElementById('drptype1').value = "";
                                    }
                                    else {
                                        alert("please select matter type");
                                        document.getElementById('drptype1').focus();
                                        document.getElementById('drptype1').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                }
                            }
                            else {
                                if (document.getElementById('divSCDECD1').value == "0") {
                                    if (document.getElementById('drptype1').value == "Select matter type" || document.getElementById('drptype1').value == "0") {
                                        alert("please select matter type");
                                        document.getElementById('drptype1').focus();
                                        document.getElementById('drptype1').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                    if (document.getElementById('txtno1').value == "") {
                                        alert("please enter matter no.");
                                        document.getElementById('txtno1').focus();
                                        document.getElementById('txtno1').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                    if (document.getElementById('drpcourtname1').value != "NC" && document.getElementById('drpcourtname1').value != "NL" && document.getElementById('drpcourtname1').value != "CF") {
                                        if (document.getElementById('txtno1').value != "") {
                                            if (/\//.test(document.getElementById('txtno1').value)) {
                                                alert("/ not allowed in matter no");
                                                document.getElementById('txtno1').focus();
                                                document.getElementById('txtno1').style.border = "1px solid red";
                                                $('#casewatchmodel').modal('show');
                                                return false;
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (document.getElementById('txtDiaryNo1').value == "") {
                                        alert("please enter diary no.");
                                        document.getElementById('txtDiaryNo1').focus();
                                        document.getElementById('txtDiaryNo1').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                }
                            }
                        }
                        if (document.getElementById('drpcourtname1').value != "SC") {
                            if (document.getElementById('txtno1').value == "") {
                                if (document.getElementById('divTCDT1').value == "1" && document.getElementById('drpcourtname1').value == "DT") {
                                    if (document.getElementById('txtDiaryNo1').value == "") {
                                        alert("please enter diary no.");
                                        document.getElementById('txtDiaryNo1').focus();
                                        return false;
                                    }
                                }

                                else {
                                    if (document.getElementById('drpcourtname1').value == "CF") {
                                        alert("please enter Appeal no.");
                                    }
                                    else {
                                        alert("please enter matter no.");
                                    }
                                    document.getElementById('txtno1').focus();
                                    document.getElementById('txtno1').style.border = "1px solid red";
                                    $('#casewatchmodel').modal('show');
                                    return false;
                                }

                            
                            }
                            if (document.getElementById('drpcourtname1').value != "NC" && document.getElementById('drpcourtname1').value != "NL" && document.getElementById('drpcourtname1').value != "CF") {
                                if (document.getElementById('txtno1').value != "") {
                                    if (/\//.test(document.getElementById('txtno1').value)) {
                                        alert("/ not allowed in matter no");
                                        document.getElementById('txtno1').focus();
                                        document.getElementById('txtno1').style.border = "1px solid red";
                                        $('#casewatchmodel').modal('show');
                                        return false;
                                    }
                                }
                            }
                        }
          
                        if (document.getElementById('drpcourtname1').value != "CF") {
                            if (document.getElementById('drpYear1').value == "" || document.getElementById('drpYear1').value == "0") {
                                alert("please select matter year");
                                document.getElementById('drpYear1').focus();
                                document.getElementById('drpYear1').style.border = "1px solid red";
                                $('#casewatchmodel').modal('show');
                                return false;
                            }
                        }

                    }
                }
            }
            else if (document.getElementById('divSCHCDistrict1').value == '3') {
                document.getElementById('drpbench1').style.border = "unset";
                document.getElementById('drpside1').style.border = "unset";
                document.getElementById('divTNBench1').style.border = "unset";
                document.getElementById('divJKBench1').style.border = "unset";
                document.getElementById('divRHBench1').style.border = "unset";
                document.getElementById('divBHBench1').style.border = "unset";
                document.getElementById('divMPBench1').style.border = "unset";
                document.getElementById('divUPBench1').style.border = "unset";
                document.getElementById('divGHBench1').style.border = "unset";
                document.getElementById('drpNCBench1').style.border = "unset";
                document.getElementById('drptype1').style.border = "unset";
                document.getElementById('txtDiaryNo1').style.border = "unset";
                document.getElementById('txtno1').style.border = "unset";
                document.getElementById('drpYear1').style.border = "unset";
                document.getElementById('drpcourtnameDC1').style.border = "unset";
                document.getElementById('drpcourtcomplexestb1').style.border = "unset";
                document.getElementById('drpcompestbcourt1').style.border = "unset";
                document.getElementById('drptype1').style.border = "unset";
                document.getElementById('txtno1').style.border = "unset";
                document.getElementById('drpYear1').style.border = "unset";
                if (document.getElementById('drpcourtnameDC1').value == "") {
                    alert("please Select the state.");
                    document.getElementById('drpcourtnameDC1').focus();
                    document.getElementById('drpcourtnameDC1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpdistrictcourtname1').value == "0") {
                    alert("please select district");
                    document.getElementById('drpdistrictcourtname1').focus();
                    document.getElementById('drpdistrictcourtname1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpcourtcomplexestb1').value == "") {
                    alert("please select court complex / court establishment");
                    document.getElementById('drpcourtcomplexestb1').focus();
                    document.getElementById('drpcourtcomplexestb1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpcompestbcourt1').value == "") {
                    alert("please select district court");
                    document.getElementById('drpcompestbcourt1').focus();
                    document.getElementById('drpcompestbcourt1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drptype1').value == "") {
                    alert("please select matter type");
                    document.getElementById('drptype1').focus();
                    document.getElementById('drptype1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('txtno1').value == "") {
                    alert("please enter matter no.");
                    document.getElementById('txtno1').focus();
                    document.getElementById('txtno1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpcourtname1').value != "NC" && document.getElementById('drpcourtname1').value != "NL" && document.getElementById('drpcourtname1').value != "CF") {
                    if (document.getElementById('txtno1').value != "") {
                        if (/\//.test(document.getElementById('txtno1').value)) {
                            alert("/ not allowed in matter no");
                            document.getElementById('txtno1').focus();
                            document.getElementById('txtno1').style.border = "1px solid red";
                            $('#casewatchmodel').modal('show');
                            return false;
                        }
                    }
                }
                if (document.getElementById('drpYear1').value == "0") {
                    alert("please select matter year");
                    document.getElementById('drpYear1').focus();
                    document.getElementById('drpYear1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
            }
            //using custom court
            else if (document.getElementById('divSCHCDistrict1').value == '5') {
                if (document.getElementById('txtno1').value == "") {
                    alert("please enter case no.");
                    document.getElementById('txtno1').focus();
                    document.getElementById('txtno1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('drpYear1').value == "0") {
                    alert("please select case year");
                    document.getElementById('drpYear1').focus();
                    document.getElementById('drpYear1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('txtcasename1').value == "") {
                    alert("please enter case name");
                    document.getElementById('txtcasename1').focus();
                    document.getElementById('txtcasename1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (document.getElementById('dtnhearingdate1').value == "") {
                    alert("please select next hearing date");
                    document.getElementById('dtnhearingdate1').focus();
                    document.getElementById('dtnhearingdate1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
            }
            //end
            else if (document.getElementById('divSCHCDistrict1').value == '6') {
                if ($("#RevenueRefNo1").val() != "" && document.getElementById('RevenueCourt1').value != "") {
                    alert("Please select only one Revenue court or Computerized Case No. ");
                    document.getElementById('RevenueCourt1').focus();
                    document.getElementById('RevenueCourt1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if ($("#RevenueRefNo1").val() != "") {
                }
                else {
                    if (document.getElementById('RevenueCourt1').value == "") {
                        alert("please select revenue court");
                        document.getElementById('RevenueCourt1').focus();
                        document.getElementById('RevenueCourt1').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueMandal1').value == "0") {
                        alert("please select revenue mandal");
                        document.getElementById('RevenueMandal1').focus();
                        document.getElementById('RevenueMandal1').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueJanpad1').value == "") {
                        alert("please enter revenue janpad");
                        document.getElementById('RevenueJanpad1').focus();
                        document.getElementById('RevenueJanpad1').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueTahsil1').value == "") {
                        alert("please select revenue tahsil");
                        document.getElementById('RevenueTahsil1').focus();
                        document.getElementById('RevenueTahsil1').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueCourtName1').value == "") {
                        alert("please select revenue court name");
                        document.getElementById('RevenueCourtName1').focus();
                        document.getElementById('RevenueCourtName1').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('Revenuetxtno1').value == "") {
                        alert("please select case no.");
                        document.getElementById('Revenuetxtno1').focus();
                        document.getElementById('Revenuetxtno1').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueYear1').value == "0") {
                        alert("please select case year");
                        document.getElementById('RevenueYear1').focus();
                        document.getElementById('RevenueYear1').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                    if (document.getElementById('RevenueYear1').value == "") {
                        alert("please select case year");
                        document.getElementById('RevenueYear1').focus();
                        document.getElementById('RevenueYear1').style.border = "1px solid red";
                        $('#casewatchmodel').modal('show');
                        return false;
                    }
                }
            }
            else {
            }
        }
        else {
            if (document.getElementById('divSCHCDistrict1').value == '2' || document.getElementById('divSCHCDistrict1').value == '3') {
            }
            else {
                alert("Please select District Court or High Court For CNR");
                $('#casewatchmodel').modal('show');
                return false;
            }
        }
        var formData = new FormData();
        if ($("#divSCHCDistrict1").val() == "6") {
            formData.append("drpcourtname", EncodeText("RevenueCourt1"));
        }
        else if ($("#divSCHCDistrict1").val() == "7") {
            formData.append("drpcourtname", EncodeText("ReraCourt"));
        }
        else {
            formData.append("drpcourtname", EncodeText($("#drpcourtname1").val()));
        }
        var addtaskmember4 = $("#addtaskmember4").val();
        formData.append("txtno", EncodeText($("#txtno1").val()));
        formData.append("drptype", EncodeText($("#drptype1").val()));
        formData.append("drpYear", EncodeText($("#drpYear1").val()));
        formData.append("txtFileNo", '');
        formData.append("drpKAbench", EncodeText($("#drpKAbench1").val()));
        formData.append("drpGoa", EncodeText($("#drpGoa1").val()));
        formData.append("drpbench", EncodeText($("#drpbench1").val()));
        formData.append("drpside", EncodeText($("#drpside1").val()));
        formData.append("drpstampregister", EncodeText($("#drpstampregister1").val()));
        formData.append("drpNCBench", EncodeText($("#drpNCBench1").val()));
        formData.append("divTNBench", EncodeText($("#divTNBench1").val()));
        formData.append("divRHBench", EncodeText($("#divRHBench1").val()));
        formData.append("divJKBench", EncodeText($("#divJKBench1").val()));
        formData.append("divBHBench", EncodeText($("#divBHBench1").val()));
        formData.append("divMPBench", EncodeText($("#divMPBench1").val()));
        formData.append("divUPBench", EncodeText($("#divUPBench1").val()));
        formData.append("divGHBench", EncodeText($("#divGHBench1").val()));
        formData.append("divWBBench", EncodeText($("#divWBBench1").val()));
        formData.append("casedetails", "");
        formData.append("txtDiaryNo", EncodeText($("#txtDiaryNo1").val()));
        formData.append("divSCHCDistrict", EncodeText($("#divSCHCDistrict1").val()));
        formData.append("drpcourtnameDC", EncodeText($("#drpcourtnameDC1").val()));
        formData.append("drpdistrictcourtname", EncodeText($("#drpdistrictcourtname1").val()));
        formData.append("drpcourtcomplexestb", EncodeText($("#drpcourtcomplexestb1").val()));
        formData.append("drpcompestbcourt", EncodeText($("#drpcompestbcourt1").val()));
        formData.append("drpncdrcstate", EncodeText($("#drpncdrcstate1").val()));
        formData.append("drpncdrcDistrict", EncodeText($("#drpncdrcDistrict1").val()));
        formData.append('txtsuffix', EncodeText(document.getElementById('txtsuffix1').value));
        //Add New Fields
        var mattertpetet = $("#drptype1 option:selected").text();
        var othercourttxt = $("#drpcourtname1 option:selected").text();
        if (othercourttxt == "-Select Court Name-") {
            othercourttxt = "";
        }
        var districtothercourt = $("#drpcompestbcourt1 option:selected").text();
        var districtcourtsatate = $("#drpcourtnameDC1 option:selected").text();
        var districtcourtdistrict = $("#drpdistrictcourtname1 option:selected").text();
        if (districtcourtdistrict == "Select Your State / UT") {
            districtcourtdistrict = "";
        }
         
        formData.append("mattertypetext", EncodeText(mattertpetet));
        formData.append("othercourttxt", EncodeText(othercourttxt));
        formData.append("districtothercourt", EncodeText(districtothercourt));
        formData.append("districtcourtsatate", EncodeText(districtcourtsatate));
        formData.append("districtcourtdistrict", EncodeText(districtcourtdistrict));
        //start revenue Court
        if (document.getElementById('RevenueRefNo1').value == "") {
            formData.append('RevenueCourt', EncodeText(document.getElementById('RevenueCourt1').value));
            formData.append('RevenueMandal', EncodeText(document.getElementById('RevenueMandal1').value));
            formData.append('RevenueJanpad', EncodeText(document.getElementById('RevenueJanpad1').value));
            formData.append('RevenueTahsil', EncodeText(document.getElementById('RevenueTahsil1').value));
            formData.append('RevenueCourtName', EncodeText(document.getElementById('RevenueCourtName1').value));
            formData.append('Revenuetxtno', EncodeText(document.getElementById('Revenuetxtno1').value));
            formData.append('RevenueYear', EncodeText(document.getElementById('RevenueYear1').value));
            formData.append('RevenueRefNo', "");
        }
        else {
            formData.append('RevenueCourt', "");
            formData.append('RevenueMandal', "");
            formData.append('RevenueJanpad', "");
            formData.append('RevenueTahsil', "");
            formData.append('RevenueCourtName', "");
            formData.append('Revenuetxtno', "");
            formData.append('RevenueYear', "");
            formData.append('RevenueRefNo', EncodeText(document.getElementById('RevenueRefNo1').value));
        }
        //End revenue Court
        //Start Rera Court
        if ($("#divSCHCDistrict1").val() == "7") {
            formData.append('ReraCourt', EncodeText(document.getElementById('divReraCourt1').value));
            formData.append('reracasetype', EncodeText(document.getElementById('reracasetype1').value));
            formData.append('reracasno', EncodeText(document.getElementById('reracasno1').value));
            formData.append('reracaseyear', EncodeText(document.getElementById('reracaseyear1').value));
            formData.append('reraRefNo', EncodeText(document.getElementById('reraRefNo1').value));
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
            ditrictidname = $("#drpdistrictcourtname1 option:selected").text();
            formData.append("drpdistrictcourtfullname", EncodeText(ditrictidname));
        }
        catch (er) {
            formData.append("drpdistrictcourtfullname", EncodeText(ditrictidname));
        }
        var drpdcourtcnr1 = $("#drpdcourtcnr1").val();
        if (drpdcourtcnr1 != "") {
            var isValid = false;
            var regex = /^[a-zA-Z0-9]*$/;
            isValid = regex.test(drpdcourtcnr1);
            if (isValid == false) {
                alert("District CNR No. should be Alphanumeric Only.");
                document.getElementById('drpdcourtcnr1').focus();
                document.getElementById('drpdcourtcnr1').style.border = "1px solid red";
                $('#casewatchmodel').modal('show');
                return false;
            }
            if (drpdcourtcnr1.length < 16 || drpdcourtcnr1.length < 16) {
                alert("District CNR No. should be equal to 16 digits.");
                document.getElementById('drpdcourtcnr1').focus();
                document.getElementById('drpdcourtcnr1').style.border = "1px solid red";
                $('#casewatchmodel').modal('show');
                return false;
            }
        }
        if ($("#divSCHCDistrict1").val() == "") {
            alert("Please Select Court Type.");
            return false;
        }
        var checkclient = $("#checkclient").val();
        var confirmPassword = "";
        var usertype1 = $('#selectusertype').val();
        var casecasetype = $("#casecasetype").val();
        var opendate = $("#codate").val();
        var clientname = "";
        var newcompanyid = "";
        formData.append("drpdcourtcnr1", EncodeText(drpdcourtcnr1));
        formData.append("caseinfo", "");
        var matterids = $("#livecaseidhide1").val();
        formData.append("matterid", matterids);
        formData.append("txtcasename", EncodeText($("#txtcasename1").val()));
        formData.append("dtnhearingdate", EncodeText($("#dtnhearingdate1").val()));
        formData.append("txtcustomadvocate", EncodeText($("#txtcustomadvocate1").val()));
        formData.append("txtcustomstatus", EncodeText($("#txtcustomstatus1").val()));
        formData.append("mattersforlink21", EncodeText($("#mattersforlink21").val()));
        formData.append("assignuser", EncodeText(addtaskmember4));
        formData.append("checkclient", EncodeText(checkclient));
        formData.append("usertypes", EncodeText(usertype1));
        formData.append("confirmPassword", EncodeText(confirmPassword));
        formData.append("casecasetype", EncodeText(casecasetype));
        formData.append("odate", EncodeText(opendate));
        formData.append("clientname", EncodeText(clientname));
        formData.append("newcompanyid", EncodeText(newcompanyid));
        openloadCW();
        $.ajax(
            {
                type: "POST",
                url: "/api/MatterApi/DirectAddCaseToCW", // Controller/View
                dataType: 'json',
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.Data == "Sorry! Unable to Add now.") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Sorry! Something went wrong, Please try again.',
                            type: 'error',
                            delay: 3000
                        });
                        closeloadCW();
                    }
                    else if (data.Data == "Cannot find table 0.") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Already Exists Email in casewatch, please update your mail to add case',
                            type: 'error',
                            delay: 3000
                        });
                        closeloadCW();
                    }
                    else if (data.Data == "Already Exists User Please Try Another User Name!") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'User ID is already exists. Please Try Another User ID !',
                            type: 'error',
                            delay: 3000
                        });
                        closeloadCW();
                    }
                    else if (data.Data == "livecaselimitexceed") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'You have exceeded limit to add Case live update from e-Courts.',
                            type: 'error',
                            delay: 3000
                        });
                        closeloadCW();
                    }
                    else if (data.Data == "livecaselimitnotfound") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Please subscribe for Case live update from e-Courts.',
                            type: 'error',
                            delay: 3000
                        });
                        closeloadCW();
                    }
                    else if (data.Data == "livecasenotactive") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'Please subscribe for Case live update from e-Courts.',
                            type: 'error',
                            delay: 3000
                        });
                        closeloadCW();
                    }
                    else if (data.Data == "livecaseaccessdenied") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'You are not authorized to access add case for live update from e-Courts',
                            type: 'error',
                            delay: 3000
                        });
                        closeloadCW();
                    }
                    else {
                        if (data.Data == "false") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'This matter is already exists.',
                                type: 'error',
                                delay: 3000
                            });
                            closeloadCW();
                        }
                        else if (data.Data == "Case Detail Already Exists!!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Matter detail already exists!',
                                type: 'error',
                                delay: 3000
                            });
                            closeloadCW();
                        }
                        else if (data.Data == "Case Detail Already Exist!!") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Matter detail already exists!',
                                type: 'error',
                                delay: 3000
                            });
                            closeloadCW();
                        }
                        else if (data.Data == "Already exist matter name. please try another matter name") {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Matter name already exists. Please try new name.',
                                type: 'error',
                                delay: 3000
                            });
                            closeloadCW();
                        }
                        else if (data.Data == "success") {
                            new PNotify({
                                title: 'Success!',
                                text: ' case saved successfully',
                                type: 'success',
                                delay: 3000
                            });
                            closeloadCW();
                            sessionStorage.setItem("directAddCW", "1");
                            resetcasewatch2();
                            var fcode5 = localStorage.getItem("FirmCode");
                            window.location = encodeURI("/" + fcode5 + "/Firm/caselist");
                        }
                        else {
                            new PNotify({
                                title: 'Warning!',
                                text: 'Sorry! Something went wrong, Please try again.',
                                type: 'error',
                                delay: 3000
                            });
                            closeloadCW();
                        }
                    }
                },
                failure: function (data) {
                    alert(data.responseText);
                    closeloadCW();
                },
                error: function (data) {
                    alert(data.responseText);
                    closeloadCW();
                }
            });
    })
});
/*Reset selected field*/
function resetselectcase1() {
    $("#casecasetype").prop("selectedIndex", 0);
    $("#caseteamlead").prop("selectedIndex", 0);
    $("#savecaseform")[0].reset();
    $("#shortcasemap").val("");
    $("#checkclient").val("");
    $("#commoncaseloginpanel").hide();
    $("#casesideuserid").val("");
    $("#casesidepassword").val("");
    $("#casesidecpassword").val("");
    $("#caseclientcontact").find('option').remove().end().append('<option value="">Select</option>');
    var today = new Date().toISOString().split('T')[0];
    $("#codate").val(today);
    $("#clientdivcommon4").css("display", "none");
    $("#clientdivcommon1").css("display", "none");
    $("#clientdivcommon2").css("display", "none");
    $("#clientdivcommon3").css("display", "none");
    $("#tracksearchcase").hide();
    addtaskmember4();
}
/*Start Revenue Court*/
function ResetRevenue1() {
    $("#RevenueCourt1,#RevenueMandal1,#RevenueJanpad1,#RevenueTahsil1,#RevenueCourtName1,#RevenueYear1,#RevenueRefNo1").empty();
    $("#Revenuetxtno1").val("");
}
/*Bind Revenue Year*/
function BindRevenueYear1(crtid) {
    $("#RevenueYear1").empty();
    $.ajax({
        type: "POST",
        url: "/firm/Addcaseyear?crtid=" + crtid,
        dataType: "json",
        success: function (data) {
            $("#RevenueYear1").append("<option value='0'>Select Matter Year</option>");
            for (var i = 0; i < data.length; i++) {
                var caseyearlength = data[i].caseyear;
            }
            startYear = new Date().getFullYear()
            for (var i = parseInt(startYear); i >= parseInt(caseyearlength); i--) {
                $("#RevenueYear1").append("<option value='" + i + "'>" + i + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*Bind revenue court*/
function BindRevenueCourt1() {
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillRevenueVCourt",
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Court</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["vCourtVal"] + '" >  ' + a["vCourtName"] + '</option>';
            });
            $("#RevenueCourt1").empty().html(option);
        },
        error: function (data) {
        }
    });
}
/*Bind revenue model*/
function BindRevenueMandal1(RevCourt) {
    $("#RevenueMandal1 option:not(:first)").remove();
    $("#RevenueJanpad1 option:not(:first)").remove();
    $("#RevenueTahsil1 option:not(:first)").remove();
    $("#RevenueCourtName1 option:not(:first)").remove();
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillMandal?RevCourt=" + RevCourt,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Mandal</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["MandalValue"] + '" >  ' + a["MandalName"] + '</option>';
            });
            $("#RevenueMandal1").empty().html(option);
        },
        error: function (data) {
        }
    });
}
/*Bind revenue janpad*/
function BindRevenueJanpad1(MandalValue) {
    $("#RevenueJanpad1 option:not(:first)").remove();
    $("#RevenueTahsil1 option:not(:first)").remove();
    $("#RevenueCourtName1 option:not(:first)").remove();
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillJanpadByMandal?MandalValue=" + MandalValue,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Janpad</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["JanpadValue"] + '" >  ' + a["JanpadName"] + '</option>';
            });
            $("#RevenueJanpad1").empty().html(option);
        },
        error: function (data) {
        }
    });
}
/*Bind revenue tahsil*/
function BindRevenueTehsil1(JanPadValue) {
    $("#RevenueTahsil1 option:not(:first)").remove();
    $("#RevenueCourtName1 option:not(:first)").remove();
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillTahsilByJanpad?JanPadValue=" + JanPadValue,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Tahsil</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["TahsilValue"] + '" >  ' + a["TahsilName"] + '</option>';
            });
            $("#RevenueTahsil1").empty().html(option);
        },
        error: function (data) {
        }
    });
}
/*Bind Revenue Court Name By Tahsil1*/
function BindRevenueCourtNameByTahsil1(TahsilValue) {
    $("#RevenueCourtName1 option:not(:first)").remove();
    var option = "";
    $.ajax({
        type: "POST",
        url: "/Revenue/FillRevenueCourtByTahsil?TahsilValue=" + TahsilValue,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Court Name</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["RevenueCourtValue"] + '" >  ' + a["RevenueCourtName"] + '</option>';
            });
            $("#RevenueCourtName1").empty().html(option);
        },
        error: function (data) {
        }
    });
}

/*Rera court start*/
function ResetReracourt1() {
    $("#reracasetype1,#reracaseyear1,#divReraCourt1").empty();
    $("#reracasno1").val("");
    $("#reraRefNo1").val("");
}
/*Fill Case type Diary1*/
function FillCasetypeDiary1() {
    $('#divSCDECD1').find('option').remove();
    $.ajax({
        async: true,
        type: "POST",
        url: "/Firm/FillCasetypeDiary",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            var option = '';
            $.each(response, function (i, a) {
                option = '<option value="' + a["id"] + '" >  ' + a["name"] + '</option>';
                $("#divSCDECD1").append(option);
            }); //End of foreach Loop
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
/*Fill case type details*/
function fillCasetype1() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/Firm/fillCasetype",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            var option = '';
            $.each(response, function (i, a) {
                option = '<option value="' + a["casetype"] + '" >  ' + a["casename"] + '</option>';
                $("#drptype1").append(option);
            }); //End of foreach Loop
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
/*Fill bench type*/
function FillBenchType1(strdivid) {
    var courtid = document.getElementById('drpcourtname1').value;
    $.ajax({
        type: "POST",
        url: "/Firm/FillBenchType?crtid=" + courtid,
        dataType: "json",
        success: function (data) {
            $("#divUPBench1").empty();
            $("#divUPBench1").append("<option value=''>Select Bench / Type</option>");
            for (var i = 0; i < data.length; i++) {
                $("#divUPBench1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*Fill WB bench type details*/
function FillBenchTypeWB(strdivid) {
    var courtid = document.getElementById('drpcourtname1').value;
    $.ajax({
        type: "POST",
        url: "/Firm/FillBenchType?crtid=" + courtid,
        dataType: "json",
        success: function (data) {
            $("#divWBBench1").empty();
            $("#divWBBench1").append("<option value=''>Select Bench / Type</option>");
            for (var i = 0; i < data.length; i++) {
                $("#divWBBench1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}

/*Fill stamp registration details*/
function FillStampRegister1() {
    $.ajax({
        type: "POST",
        url: "/AddCase/FillStampRegister",
        dataType: "json",
        success: function (data) {
            $("#drpstampregister1").empty();
            for (var i = 0; i < data.length; i++) {
                $("#drpstampregister1").append("<option value='" + data[i].value + "'>" + data[i].Name + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*Check court validation type*/
function validationcourt1() {
    if (document.getElementById("drpcourtname1").value == "0") {
        alert("please select court");
        return false;
    }
}
/*Hide div SCDE1*/
function hiddivSCDE1() {
    document.getElementById('drptype1').value = "0";
    document.getElementById('txtno1').value = "";
    document.getElementById('drpYear1').value = "0";
    $("#divcaseno1").toggle();
    $("#divcasetype1").toggle();
    $("#divdiaryno1").hide();
    if (document.getElementById('divSCDECD1').value == "1") {
        $("#divcaseno1").hide();
        $("#divcasetype1").hide();
        $("#divdiaryno1").toggle();
    }
}
function divdisplay1() {
    if (document.getElementById("drpcourtname1").value == "CF") {
        document.getElementById('divsuffix1').style.display = "none";
        $("#txtno1").attr("placeholder", "Follow the format for indexing and search results");
    }
    else {
        $("#txtno1").attr("placeholder", "");
        document.getElementById('txtsuffix1').value = "";
        document.getElementById('divsuffix1').style.display = "none";
    }
    $("#drpYear1").empty();
    $("#drpbench1").empty();
    $("#drptype1").empty();
    $("#drpNCBench1").empty();
    $("#divdiaryno1").hide();
    $("#divSCDE1").hide();
    if (document.getElementById("drpcourtname1").value == "DT") {
        $("#divTCCD1").show();
    }
    else {
        $("#divdiaryno1").hide();
        $("#divTCCD1").hide();
    }
    document.getElementById('drpGoa1').value = "";
    document.getElementById('divSCDECD1').value = "0";
    document.getElementById('txtDiaryNo1').value = "";
    //For hide OERC Case
    if (document.getElementById("drpcourtname1").value == "OERC") {
        document.getElementById('divcasetype1').style.display = "none";
        document.getElementById('divsuffix1').style.display = "none";
        $('#labelcaseNo').contents().first()[0].textContent = 'Matter Number';
        document.getElementById('information').style.display = "none";



    }

    else if (document.getElementById("drpcourtname1").value == "CF") {
        document.getElementById('divcasetype1').style.display = "none";
        document.getElementById('drpyearshow').style.display = "none";
        //$('#labelcaseNo').text('Appeal No.');
        $('#labelcaseNo').contents().first()[0].textContent = 'Appeal Number';
        document.getElementById('information').style.display = "block";

    }

    else {
        document.getElementById('divcasetype1').style.display = "block";
        document.getElementById('drpyearshow').style.display = "block";
        $('#labelcaseNo').contents().first()[0].textContent = 'Matter Number';
        document.getElementById('information').style.display = "none";

    }
    document.getElementById('divcaseno1').style.display = "block";
    document.getElementById('divRH1').style.display = "none";
    document.getElementById('divJK1').style.display = "none";
    document.getElementById('divNC1').style.display = "none";
    document.getElementById('savebtn1').style.display = "none";
    document.getElementById("divKA1").style.display = "none";
    document.getElementById('divMHGoa1').style.display = "none";
    document.getElementById('divTN1').style.display = "none";
    document.getElementById('divBH1').style.display = "none";
    document.getElementById('divMP1').style.display = "none";
    document.getElementById('divMHGoa1').style.display = "none";
    document.getElementById("divMH1").style.display = "none";
    document.getElementById('divUP1').style.display = "none";
    document.getElementById('divGH1').style.display = "none";
    document.getElementById('lblcourtname1').innerHTML = "";
    document.getElementById('Court1').style.display = "none";
    document.getElementById("divWB1").style.display = "none";
    document.getElementById("divWBBench1").style.display = "none";
    $("#divWBBench1").val("");
    document.getElementById('lbldistrictname1').style.display = "none";
    var crtid = document.getElementById('drpcourtname1').value;
    var courtname = document.getElementById('drpcourtname1').value;
    var x = document.getElementById("drpcourtname1");
    FillStampRegister1();
    if (crtid != "0") {
        $.ajax({
            type: "POST",
            url: "/firm/Addcaseyear?crtid=" + crtid,
            dataType: "json",
            success: function (data) {
                $("#drpYear1").append("<option value='0'>Select Matter Year</option>");
                for (var i = 0; i < data.length; i++) {
                    var caseyearlength = data[i].caseyear;
                }
                startYear = new Date().getFullYear()
                for (var i = parseInt(startYear); i >= parseInt(caseyearlength); i--) {
                    $("#drpYear1").append("<option value='" + i + "'>" + i + "</option>");
                }
            },
            error: function (data) {
            }
        });
        document.getElementById('lbldistrictname1').innerHTML = "";
        var selectedText = $("#drpcourtname1").find("option:selected").text();
        document.getElementById('lbldistrictname1').style.display = "block";
        document.getElementById('Court1').style.display = "block";
        document.getElementById('savebtn1').style.display = "block";
        document.getElementById('lbldistrictname1').innerHTML = "<center><h4>Selected: <span>" + selectedText + "</span> </h4></center><hr style='border:1px solid #e6cfcf;margin-top:10px; margin-bottom:0px;'>"
        if (document.getElementById("divSCHCDistrict1").value == "5") {
            document.getElementById('divcasetype1').style.display = "none";
            document.getElementById('divcustomcourtsection1').style.display = "block";
            if (document.getElementById("drpcourtname1").value == "newcustomcourt") {
            }
            else {
                document.getElementById("txtnewcustomcourt1").value = "";
            }
        }
        else {
            document.getElementById('divcustomcourtsection1').style.display = "none";
        }
        if (crtid == 'SC') {
            $("#divSCDE1").toggle();
            document.getElementById('divcasetype1').style.display = "block";
            document.getElementById('divcaseno1').style.display = "block";
        }
        if (crtid == 'MH') {
            document.getElementById("divMHGoa1").style.display = "block";
            document.getElementById("divMH1").style.display = "block";
        }
        if (crtid == 'KA') {
            document.getElementById('divKA1').style.display = "block";
        }
        if (crtid == 'NC' || crtid == 'NL' || crtid == 'IT' || crtid == 'CE' || crtid == 'DT' || crtid == 'CF' || crtid == 'CT' || crtid == 'CI' || crtid == 'RC' || crtid == 'NGT') {
            document.getElementById('divNC1').style.display = "block";
            getbench1(crtid);
        }
        if (crtid != 'CF') {
            document.getElementById('divncdrcstate1').style.display = "none";
            document.getElementById('divncdrcDistrict1').style.display = "none";
        } hiddivNC1();
        if (crtid == 'TN') {
            document.getElementById("divTN1").style.display = "block";
            document.getElementById("divTNBench1").style.display = "block";
        }
        if (crtid == 'RH') {
            document.getElementById('divRH1').style.display = "block";
            document.getElementById('divRHBench1').style.display = "block";
        }
        if (crtid == 'JK') {
            document.getElementById('divJK1').style.display = "block";
            document.getElementById('divJKBench1').style.display = "block";
        }
        if (crtid == 'BH') {
            document.getElementById("divBH1").style.display = "block";
            document.getElementById("divBHBench1").style.display = "block";
        }
        if (crtid == 'MP') {
            document.getElementById("divMP1").style.display = "block";
            document.getElementById("divMPBench1").style.display = "block";
        }
        if (crtid == 'UP') {
            document.getElementById('divUP1').style.display = "block";
            document.getElementById('divUPBench1').style.display = "block";
            //added by umesh on 28 jan 20
            FillBenchType1();
        }
        if (crtid == 'GH') {
            document.getElementById('divGH1').style.display = "block";
            document.getElementById('divGHBench1').style.display = "block";
        }
        if (crtid == 'WB') {
            document.getElementById("divWB1").style.display = "block";
            document.getElementById("divWBBench1").style.display = "block";
            FillBenchTypeWB();
        }
        if (crtid != 'IT') {
            getCasetype(crtid, '', '', '');
        }
        else {
            $("#drptype1 option").remove();
            $.ajax({
                type: "POST",
                url: "/AddCase/AddcasetypeITCE?crtid=" + crtid + "&courttitle=&side=",
                dataType: "json",
                success: function (data) {
                    $("#drptype1").append("<option value='0'>-Select Matter Type-</option>");
                    for (var i = 0; i < data.length; i++) {
                        $("#drptype1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                    }
                },
                error: function (data) {
                }
            });
        }
    }
}
/*for DRT case Number*/
function hiddivTCDT1() {
    document.getElementById('drptype1').value = "0";
    document.getElementById('txtno1').value = "";
    document.getElementById('drpYear1').value = "0";
    document.getElementById("drpNCBench1").value = "0";
    $("#divcaseno1").toggle();
    $("#divcasetype1").toggle();
    $("#divdiaryno1").hide();
    if (document.getElementById('divTCDT1').value == "1") {
        $("#divcaseno1").hide();
        $("#divcasetype1").hide();
        $("#divdiaryno1").toggle();
    }
    else {
        document.getElementById('txtDiaryNo1').value = "";
    }
}
/*Show adding case type*/
function showaddingcasetype1() {
    $("#drpYear1").empty();
    $("#drpbench1").empty();
    $("#drptype1").empty();
    $("#drpNCBench1").empty();
    $("#divdiaryno1").hide();
    $("#divSCDE1").hide();
    document.getElementById('drpGoa1').value = "";
    document.getElementById('divSCDECD1').value = "0";
    document.getElementById('txtDiaryNo1').value = "";
    document.getElementById('divcasetype1').style.display = "block";
    document.getElementById('divcaseno1').style.display = "block";
    document.getElementById('divRH1').style.display = "none";
    document.getElementById('divJK1').style.display = "none";
    document.getElementById('divNC1').style.display = "none";
    document.getElementById('savebtn1').style.display = "none";
    document.getElementById("divKA1").style.display = "none";
    document.getElementById('divMHGoa1').style.display = "none";
    document.getElementById('divTN1').style.display = "none";
    document.getElementById('divBH1').style.display = "none";
    document.getElementById('divMP1').style.display = "none";
    document.getElementById('divMHGoa1').style.display = "none";
    document.getElementById("divMH1").style.display = "none";
    document.getElementById('divUP1').style.display = "none";
    document.getElementById('lblcourtname1').innerHTML = "";
    document.getElementById('Court1').style.display = "none";
    document.getElementById('lbldistrictname1').style.display = "none";
    document.getElementById('drpcourtname1').value = 'SC';
    var crtid = document.getElementById('drpcourtname1').value;
    var courtname = document.getElementById('drpcourtname1').value;
    var x = document.getElementById("drpcourtname1");
    crtid = "SC";
    if (crtid != "0") {
        $.ajax({
            type: "POST",
            url: "/firm/Addcaseyear?crtid=" + crtid,
            dataType: "json",
            success: function (data) {
                $("#drpYear1").append("<option value='0'>Select Matter Year</option>");
                for (var i = 0; i < data.length; i++) {
                    var caseyearlength = data[i].caseyear;
                }
                startYear = new Date().getFullYear()
                for (var i = parseInt(startYear); i >= parseInt(caseyearlength); i--) {
                    $("#drpYear1").append("<option value='" + i + "'>" + i + "</option>");
                }
            },
            error: function (data) {
            }
        });
        document.getElementById('lbldistrictname1').innerHTML = "";
        var selectedText = $("#drpcourtname1").find("option:selected").text();
        document.getElementById('lbldistrictname1').style.display = "block";
        document.getElementById('Court1').style.display = "block";
        document.getElementById('savebtn1').style.display = "block";
        document.getElementById('lbldistrictname1').innerHTML = "<center><h4>Selected: <span>" + "SUPREME COURT" + "</span> </h4></center><hr style='border:1px solid #e6cfcf;margin-top:10px; margin-bottom:0px;'>"
        if (crtid == 'SC') {
            $("#divSCDE1").toggle();
            document.getElementById('divcasetype1').style.display = "block";
            document.getElementById('divcaseno1').style.display = "block";
            $.ajax({
                type: "POST",
                url: "/AddCase/AddcasetypeITCE?crtid=" + crtid + "&courttitle=&side=",
                dataType: "json",
                success: function (data) {
                    $("#drptype1").append("<option value='0'>-Select Matter Type-</option>");
                    for (var i = 0; i < data.length; i++) {
                        $("#drptype1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                    }
                },
                error: function (data) {
                }
            });
        }
    }
}
/*Get bench address*/
function benchadd1(crtid) {
    $.ajax({
        type: "POST",
        url: "/AddCase/AddBenchtype?bench=" + crtid,
        dataType: "json",
        success: function (data) {
            $("#drpNCBench1").append("<option value='0'>-Select Bench / Type-</option>");
            for (var i = 0; i < data.length; i++) {
                $("#drpNCBench1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
function getbench1(crtid) {
    var str = "";
    benchadd1(crtid);
}
/*Hide div NCDRC District1*/
function hiddivNCDRCDistrict1() {
    if (document.getElementById('drpNCBench1').value == "E") {
        var stateid = document.getElementById("drpncdrcstate1").value;
        fillNCDRCDistrict1(stateid);
        document.getElementById("divncdrcDistrict1").style.display = "block";
    }
    else {
        document.getElementById('divncdrcDistrict1').style.display = "none";
    }
}
/*Fill NCDRC state*/
function fillNCDRCState1(crtid, benchid) {
    var idist = 0;
    if (benchid == "E") {
        $("#drpncdrcstate1").html("");
        document.getElementById('divncdrcDistrict1').style.display = "block";
        idist = 1;
    }
    else {
        document.getElementById('divncdrcDistrict1').style.display = "none";
    }
    $("#drpncdrcstate1").html("");
    $("#drpncdrcstate1").empty;
    $.ajax({
        type: "POST",
        url: "/AddCase/AddFillTriDistrictState?courtid=" + crtid + "&courttype=" + document.getElementById("divSCHCDistrict1").value + "&iDistrict=" + idist,
        dataType: "json",
        success: function (data) {
            $("#drpncdrcstate1").append("<option value='0'>-Select the state.-</option>");
            for (var i = 0; i < data.length; i++) {
                $("#drpncdrcstate1").append("<option value='" + data[i].Stateid + "'>" + data[i].Statename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*Fill NCDRC district*/
function fillNCDRCDistrict1(stateid) {
    $("#drpncdrcDistrict1").html("");
    $("#drpncdrcDistrict1").empty;
    $.ajax({
        type: "POST",
        url: "/AddCase/AddFillTriDistrictStatebyStateid?stateid=" + stateid,
        dataType: "json",
        success: function (data) {
            $("#drpncdrcDistrict1").append("<option value='0'>-Select District Forum-</option>");
            for (var i = 0; i < data.length; i++) {
                $("#drpncdrcDistrict1").append("<option value='" + data[i].DistrictId + "'>" + data[i].District + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*Get case type details*/
function getCasetype(crtid, bench, side, vcourttitle) {
    if (crtid == 'TN' && bench == '') {
        document.getElementById('divTNBench1').value = '';
        return;
    }
    if (crtid == 'RH' && bench == '') {
        document.getElementById('divRHBench1').value = '';
        return;
    }
    if (crtid == 'JK' && bench == '') {
        document.getElementById('divJKBench1').value = '';
        return;
    }
    if (crtid == 'NC' && bench == '') {
        document.getElementById('drpNCBench1').value = '';
        return;
    }
    if (crtid == 'UP' && bench == '') {
        document.getElementById('divUPBench1').value = '';
        return;
    }
    if (crtid == 'GH' && bench == '') {
        document.getElementById('divGHBench1').value = '';
        return;
    }
    if (crtid == 'WB' && bench == '') {
        document.getElementById('divWBBench1').value = '';
        return;
    }
    if (crtid != "MH" && crtid != "TN" && crtid != "RH" && crtid != "UP" && crtid != "GH" && crtid != "JK" && crtid != "BH" && crtid != "MP" && crtid != "NC" && crtid != "CE" && crtid != "IT" && crtid != "DT"
        && crtid != "CT" && crtid != "CI" && crtid != "RC" && crtid != "WB" && crtid != "NL") {
        $("#drptype1").empty();
        $.ajax({
            type: "POST",
            url: "/AddCase/Addcasetype?crtid=" + crtid + "&courttitle=" + vcourttitle + "&side=" + side,
            dataType: "json",
            success: function (data) {
                $("#drptype1").empty();
                $("#drptype1").append("<option value='0'>-Select Matter Type-</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drptype1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
    else {
        if (vcourttitle != 'Goa' && bench == '') {
            document.getElementById('drpbench1').innerHtml = "";
            $("#drpbench1").empty;
            $.ajax({
                type: "POST",
                url: "/AddCase/GetBenchName?crtid=" + crtid,
                dataType: "json",
                success: function (data) {
                    $("#drpbench1").append("<option value='0'>-Select Bench / Type-</option>");
                    for (var i = 0; i < data.length; i++) {
                        $("#drpbench1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                    }
                },
                error: function (data) {
                }
            });
        }
        else {
            $("#drptype1 option").remove();
            $("#drptype1").empty();
            $.ajax({
                type: "POST",
                url: "/AddCase/Addcasetype?crtid=" + crtid + "&courttitle=" + vcourttitle + "&bench=" + bench + "&side=" + side,
                dataType: "json",
                success: function (data) {
                    $("#drptype1").append("<option value='0'>-Select Matter Type-</option>");
                    for (var i = 0; i < data.length; i++) {
                        $("#drptype1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                    }
                },
                error: function (data) {
                }
            });
        }
    }
}
/*Reset casewatch details*/
function resetcasewatch2() {
    ResetRevenue1();
    ResetReracourt1();
    document.getElementById('ReraCourtDiv1').style.display = 'none';
    document.getElementById('RevenueCourtDiv1').style.display = 'none';
    document.getElementById("divSCHCDistrict1").selectedIndex = "0";
    document.getElementById('HighCourt1').style.display = 'none';
    document.getElementById('DistrictCourt1').style.display = 'none';
    document.getElementById('drpcourtcomplexestb1').style.display = 'none';
    document.getElementById('drpdistrictcourtname1').style.display = 'none';
    document.getElementById('drpcompestbcourt1').style.display = 'none';
    document.getElementById('lbldistrictname1').innerHTML = "";
    document.getElementById('divncdrcstate1').style.display = 'none';
    document.getElementById('divncdrcDistrict1').style.display = 'none';
    document.getElementById("divWB1").style.display = "none";
    document.getElementById("divWBBench1").style.display = "none";
    $("#cnrdivdata1").hide();
    $("#divWBBench1").val("");
    $("#drpdistrictcourtname1").val("");
    $('#drpcourtname1').empty();
    $('#drpcourtnameDC1').empty();
    $("#drpYear1").empty();
    $("#drptype1").empty();
    $("#drpNCBench1").empty();
    $("#divdiaryno1").hide();
    $("#divSCDE1").hide();
    $("#drpGoa1").val = "";
   // $('#casedetails1').val('');
    $('#txtno1').val('');
    $('#drpncdrcstate1').empty();
    $('#drpncdrcDistrict1').empty();
    $('#drpdcourtcnr1').val("");
    document.getElementById('drpbench1').style.border = "unset";
    document.getElementById('drpside1').style.border = "unset";
    document.getElementById('divTNBench1').style.border = "unset";
    document.getElementById('divJKBench1').style.border = "unset";
    document.getElementById('divRHBench1').style.border = "unset";
    document.getElementById('divBHBench1').style.border = "unset";
    document.getElementById('divMPBench1').style.border = "unset";
    document.getElementById('divUPBench1').style.border = "unset";
    document.getElementById('divGHBench1').style.border = "unset";
    document.getElementById('drpNCBench1').style.border = "unset";
    document.getElementById('drpNCBench1').style.border = "unset";
    document.getElementById('drptype1').style.border = "unset";
    document.getElementById('drptype1').style.border = "unset";
    document.getElementById('drpYear1').style.border = "unset";
    document.getElementById('drpcourtnameDC1').style.border = "unset";
    document.getElementById('drpcourtcomplexestb1').style.border = "unset";
    document.getElementById('drpcompestbcourt1').style.border = "unset";
    document.getElementById('drptype1').style.border = "unset";
    document.getElementById('drpYear1').style.border = "unset";
    document.getElementById('divSCDECD1').value = "0";
    document.getElementById('txtDiaryNo1').value = "";
    document.getElementById('divcasetype1').style.display = "block";
    document.getElementById('divcaseno1').style.display = "block";
    document.getElementById('divRH1').style.display = "none";
    document.getElementById('divJK1').style.display = "none";
    document.getElementById('divNC1').style.display = "none";
    document.getElementById('savebtn1').style.display = "none";
    document.getElementById("divKA1").style.display = "none";
    document.getElementById('divMHGoa1').style.display = "none";
    document.getElementById('divTN1').style.display = "none";
    document.getElementById('divBH1').style.display = "none";
    document.getElementById('divMP1').style.display = "none";
    document.getElementById('divMHGoa1').style.display = "none";
    document.getElementById("divMH1").style.display = "none";
    document.getElementById('divUP1').style.display = "none";
    document.getElementById('divGH1').style.display = "none";
    document.getElementById('lblcourtname1').innerHTML = "";
    document.getElementById('Court1').style.display = "none";
    document.getElementById('dtnhearingdate1').value = "";
    document.getElementById('txtcustomadvocate1').value = "";
    document.getElementById('txtcustomstatus1').value = "";
    document.getElementById('txtcasename1').value = "";
    //Reset Colomn 
    $("#mattersforlink21").val('');
    addtaskmember4();
}
/*Fill case type*/
function fillCasetype1() {
    var bench = document.getElementById('drpbench1').value;
    var side = document.getElementById('drpside1').value;
    var crtid = document.getElementById('drpcourtname1').value;
    document.getElementById("drptype1").innerHTML = '';
    getCasetype(crtid, bench, side, '');
}
/*Hide case year div*/
function hiddiv1() {
    $("#drpYear1").empty();
    document.getElementById("drpbench1").innerHTML = "";
    document.getElementById("drpside1").innerHTML = "";
    document.getElementById("drptype1").innerHTML = "";
    if (document.getElementById('drpGoa1').value == 'Goa') {
        $.ajax({
            type: "POST",
            url: "/firm/Addcaseyear?crtid=" + document.getElementById('drpGoa1').value,
            dataType: "json",
            success: function (data) {
                $("#drpYear1").append("<option value='0'>Select Matter Year</option>");
                for (var i = 0; i < data.length; i++) {
                    var caseyearlength = data[i].caseyear;
                }
                startYear = new Date().getFullYear()
                for (var i = parseInt(startYear); i >= parseInt(caseyearlength); i--) {
                    $("#drpYear1").append("<option value='" + i + "'>" + i + "</option>");
                }
            },
            error: function (data) {
            }
        });
        document.getElementById('divMH1').style.display = "none";
        getCasetype('MH', '', '', 'Goa');
    }
    else {
        $.ajax({
            type: "POST",
            url: "/firm/Addcaseyear?crtid=" + document.getElementById('drpcourtname1').value,
            dataType: "json",
            success: function (data) {
                $("#drpYear1").append("<option value='0'>Select Matter Year</option>");
                for (var i = 0; i < data.length; i++) {
                    var caseyearlength = data[i].caseyear;
                }
                startYear = new Date().getFullYear()
                for (var i = parseInt(startYear); i >= parseInt(caseyearlength); i--) {
                    $("#drpYear1").append("<option value='" + i + "'>" + i + "</option>");
                }
            },
            error: function (data) {
            }
        });
        document.getElementById('divMH1').style.display = "block";
        getCasetype('MH', '', '', '');
    }
}
function fillside1() {
    $("#drptype1").empty();
    var bench = document.getElementById('drpbench1').value;
    document.getElementById("drpside1").innerHTML = '';
    GetSide(bench);
}
/*Get bench side details*/
function GetSide(benchid) {
    document.getElementById('drpside1').innerHtml = "";
    $("#drpside1").empty;
    $.ajax({
        type: "POST",
        url: "/AddCase/GetSide?benchid=" + benchid + "&court=" + document.getElementById("drpcourtname1").value,
        dataType: "json",
        success: function (data) {
            $("#drpside1").append("<option value='0'>-Select Side-</option>");
            for (var i = 0; i < data.length; i++) {
                $("#drpside1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*Hide tn div*/
function hiddivTN1() {
    document.getElementById("drptype1").innerHTML = "";
    if (document.getElementById('divTNBench1').value == '') {
        document.getElementById("drptype1").innerHTML = "";
    }
    if (document.getElementById('divTNBench1').value == "1") {
        getCasetype('TN', '1', '', '');
        return;
    }
    if (document.getElementById('divTNBench1').value == "0") {
        getCasetype('TN', '0', '', '');
        return;
    }
}
/*Hide RH div*/
function hiddivRH1() {
    document.getElementById("drptype1").innerHTML = "";
    if (document.getElementById('divRHBench1').value == '') {
        document.getElementById("drptype1").innerHTML = "";
    }
    if (document.getElementById('divRHBench1').value == '1') {
        getCasetype('RH', '1', '', '');
        return;
    }
    if (document.getElementById('divRHBench1').value == '0') {
        getCasetype('RH', '0', '', '');
        return;
    }
}
/*Hide NC div*/
function hiddivNC1() {
    if (document.getElementById('drpcourtname1').value == "NC" || document.getElementById('drpcourtname1').value == "CE" || document.getElementById('drpcourtname1').value == "IT"
        || document.getElementById('drpcourtname1').value == "DT" || document.getElementById('drpcourtname1').value == "CT" ||
        document.getElementById('drpcourtname1').value == "CI" || document.getElementById('drpcourtname1').value == "AFT" ||
        document.getElementById('drpcourtname1').value == "RC" || document.getElementById('drpcourtname1').value == "NL") {
        document.getElementById("drptype1").innerHTML = "";
        if (document.getElementById('drpNCBench1').value == '') {
            document.getElementById("drptype1").innerHTML = "";
        }
        getCasetype(document.getElementById('drpcourtname1').value, document.getElementById('drpNCBench1').value, '', '');
    }
    if (document.getElementById('drpcourtname1').value == "CF") {
        if (document.getElementById('drpNCBench1').value == "B") {
            document.getElementById('divncdrcstate1').style.display = "none";
            document.getElementById('divncdrcDistrict1').style.display = "none";
        }
        else if (document.getElementById('drpNCBench1').value == "C" || document.getElementById('drpNCBench1').value == "E") {
            fillNCDRCState1("CF", document.getElementById('drpNCBench1').value);
            document.getElementById('divncdrcstate1').style.display = "block";
        }
        else {
            document.getElementById('divncdrcstate1').style.display = "none";
        }
    }
    return;
}
/*Hide JK div*/
function hiddivJK1() {
    document.getElementById("drptype1").innerHTML = "";
    if (document.getElementById('divJKBench1').value == '') {
        document.getElementById("drptype1").innerHTML = "";
    }
    if (document.getElementById('divJKBench1').value == '1') {
        getCasetype('JK', '1', '', '');
        return;
    }
    if (document.getElementById('divJKBench1').value == '0') {
        getCasetype('JK', '0', '', '');
        return;
    }
}
/*Hide BH div*/
function hiddivBH1() {
    document.getElementById("drptype1").innerHTML = "";
    if (document.getElementById('divBHBench1').value == '') {
        document.getElementById("drptype1").innerHTML = "";
    }
    if (document.getElementById('divBHBench1').value == "1") {
        getCasetype('BH', '1', '', '');
        return;
    }
    if (document.getElementById('divBHBench1').value == "0") {
        getCasetype('BH', '0', '', '');
        return;
    }
}
/*Hide MP div*/
function hiddivMP1() {
    document.getElementById("drptype1").innerHTML = "";
    if (document.getElementById('divMPBench1').value == '') {
        document.getElementById("drptype1").innerHTML = "";
    }
    if (document.getElementById('divMPBench1').value == "01") {
        getCasetype('MP', '01', '', '');
        return;
    }
    if (document.getElementById('divMPBench1').value == "02") {
        getCasetype('MP', '02', '', '');
        return;
    }
    if (document.getElementById('divMPBench1').value == "03") {
        getCasetype('MP', '03', '', '');
        return;
    }
}
/*Hide UP div*/
function hiddivUP1() {
    document.getElementById("drptype1").innerHTML = "";
    if (document.getElementById('divUPBench1').value == '') {
        document.getElementById("drptype1").innerHTML = "";
    }
    if (document.getElementById('divUPBench1').value == '1') {
        getCasetype('UP', '1', '', '');
        return;
    }
    if (document.getElementById('divUPBench1').value == '0') {
        getCasetype('UP', '0', '', '');
        return;
    }
}
/*Hide GH div*/
function hiddivGH1() {
    document.getElementById("drptype1").innerHTML = "";
    if (document.getElementById('divGHBench1').value == '') {
        document.getElementById("drptype1").innerHTML = "";
    }
    if (document.getElementById('divGHBench1').value == '1') {
        getCasetype('GH', '1', '', '');
        return;
    }
    if (document.getElementById('divGHBench1').value == '0') {
        getCasetype('GH', '0', '', '');
        return;
    }
    if (document.getElementById('divGHBench1').value == '2') {
        getCasetype('GH', '2', '', '');
        return;
    }
    if (document.getElementById('divGHBench1').value == '3') {
        getCasetype('GH', '3', '', '');
        return;
    }
}
/*Hide WB div*/
function hiddivWB1() {
    document.getElementById("drptype1").innerHTML = "";
    if (document.getElementById('divWBBench1').value == '') {
        document.getElementById("drptype1").innerHTML = "";
    }
    if (document.getElementById('divWBBench1').value == '1') {
        getCasetype('WB', '1', '', '');
        return;
    }
    if (document.getElementById('divWBBench1').value == '0') {
        getCasetype('WB', '0', '', '');
        return;
    }
    if (document.getElementById('divWBBench1').value == '2') {
        getCasetype('WB', '2', '', '');
        return;
    }
    if (document.getElementById('divWBBench1').value == '3') {
        getCasetype('WB', '3', '', '');
        return;
    }
}
/*Add validation*/
function validation() {
    if (document.getElementById('divSCHCDistrict1').value == '1') {
        document.getElementById('drpcourtname1').value = "SC";
    }
    if (document.getElementById('divSCHCDistrict1').value == '1' || document.getElementById('divSCHCDistrict1').value == '2' || document.getElementById('divSCHCDistrict1').value == '4') {
        if (document.getElementById('drpcourtname1').value != "0") {
            if (document.getElementById('drpcourtname1').value == "MH") {
                if (document.getElementById('drpGoa1').value != "Goa") {
                    if (document.getElementById('drpbench1').value == "Select Bench" || document.getElementById('drpbench1').value == "" || document.getElementById('drpbench1').value == "0") {
                        alert("please select bench");
                        document.getElementById('drpbench1').focus();
                        return false;
                    }
                    if (document.getElementById('drpside1').value == "" || document.getElementById('drpside1').value == "Select Side" || document.getElementById('drpside1').value == "0") {
                        alert("please select side");
                        document.getElementById('drpside1').focus();
                        return false;
                    }
                }
            }
            if (document.getElementById('drpcourtname1').value == "TN") {
                if (document.getElementById('divTNBench1').value == "") {
                    if (document.getElementById('divTNBench1').value == "Select Bench" || document.getElementById('divTNBench1').value == "" || document.getElementById('divTNBench1').value == "0") {
                        alert("please select bench");
                        document.getElementById('divTNBench1').focus();
                        return false;
                    }
                }
            }
            if (document.getElementById('drpcourtname1').value == "JK") {
                if (document.getElementById('divJKBench1').value == "Select Bench" || document.getElementById('divJKBench1').value == "") {
                    alert("please select bench");
                    document.getElementById('divJKBench1').focus();
                    return false;
                }
            }
            if (document.getElementById('drpcourtname1').value == "RH") {
                if (document.getElementById('divRHBench1').value == "") {
                    if (document.getElementById('divRHBench1').value == "Select Bench" || document.getElementById('divRHBench1').value == "") {
                        alert("please select bench");
                        document.getElementById('divRHBench1').focus();
                        return false;
                    }
                }
            }
            if (document.getElementById('drpcourtname1').value == "BH") {
                if (document.getElementById('divBHBench1').value == "") {
                    if (document.getElementById('divBHBench1').value == "Select Bench" || document.getElementById('divBHBench1').value == "" || document.getElementById('divBHBench1').value == "0") {
                        alert("please select type");
                        document.getElementById('divBHBench1').focus();
                        return false;
                    }
                }
            }
            if (document.getElementById('drpcourtname1').value == "MP") {
                if (document.getElementById('divMPBench1').value == "") {
                    if (document.getElementById('divMPBench1').value == "Select Bench" || document.getElementById('divMPBench1').value == "" || document.getElementById('divMPBench1').value == "0") {
                        alert("please select type");
                        document.getElementById('divMPBench1').focus();
                        return false;
                    }
                }
            }
            if (document.getElementById('drpcourtname1').value == "UP") {
                if (document.getElementById('divUPBench1').value == "") {
                    if (document.getElementById('divUPBench1').value == "Select Bench" || document.getElementById('divUPBench1').value == "") {
                        alert("please select bench");
                        document.getElementById('divUPBench1').focus();
                        return false;
                    }
                }
            }
            if (document.getElementById('drpcourtname1').value == "GH") {
                if (document.getElementById('divGHBench1').value == "") {
                    if (document.getElementById('divGHBench1').value == "Select Bench" || document.getElementById('divGHBench1').value == "") {
                        alert("please select bench");
                        document.getElementById('divGHBench1').focus();
                        return false;
                    }
                }
            }
            if (document.getElementById('drpcourtname1').value != "") {
                if (document.getElementById('drpcourtname1').value == "NC" || document.getElementById('drpcourtname1').value == "NL" || document.getElementById('drpcourtname1').value == "DT" || document.getElementById('drpcourtname1').value == "CF"
                    || document.getElementById('drpcourtname1').value == "NGT") {
                    if (document.getElementById('drpNCBench1').value == "Select Bench" || document.getElementById('drpNCBench1').value == "0") {
                        alert("please select bench");
                        document.getElementById('drpNCBench1').focus();
                        return false;
                    }
                    if (document.getElementById('drpNCBench1').value == "C" || document.getElementById('drpNCBench1').value == "E") {
                        if (document.getElementById('drpncdrcstate1').value == "0") {
                            alert("please select state");
                            document.getElementById('drpncdrcstate1').focus();
                            return false;
                        }
                        if (document.getElementById('drpNCBench1').value == "E") {
                            if (document.getElementById('drpncdrcDistrict1').value == "0") {
                                alert("please select district forum");
                                document.getElementById('drpncdrcDistrict1').focus();
                                return false;
                            }
                        }
                    }
                }
                if (document.getElementById('drpcourtname1').value == "IT" || document.getElementById('drpcourtname1').value == "CE") {
                    if (document.getElementById('drpNCBench1').value == "Select Bench" || document.getElementById('drpNCBench1').value == "0") {
                        alert("please select bench");
                        document.getElementById('drpNCBench1').focus();
                        return false;
                    }
                }
                if (document.getElementById('drpcourtname1').value != "NC" && document.getElementById('drpcourtname1').value != "NL" || document.getElementById('drpcourtname1').value == "DT") {
                    if (document.getElementById('drpcourtname1').value != "SC") {
                        if (document.getElementById('drptype1').value == "Select Matter Type" || document.getElementById('drptype1').value == "0") {
                            if (document.getElementById('divTCDT1').value == "1" && document.getElementById('drpcourtname1').value == "DT") {
                                if (document.getElementById('txtDiaryNo1').value == "") {
                                    alert("please enter diary no.");
                                    document.getElementById('txtDiaryNo1').focus();
                                    return false;
                                }
                            }
                            else {
                                alert("please select matter type");
                                document.getElementById('drptype1').focus();
                                return false;
                            }
                        }
                    }
                    else {
                        if (document.getElementById('divSCDECD1').value == "0") {
                            if (document.getElementById('drptype1').value == "Select Matter Type" || document.getElementById('drptype1').value == "0") {
                                alert("please select matter type");
                                document.getElementById('drptype1').focus();
                                return false;
                            }
                            if (document.getElementById('txtno1').value == "") {
                                alert("please enter matter no.");
                                document.getElementById('txtno1').focus();
                                return false;
                            }
                            if (document.getElementById('drpcourtname1').value != "NC" && document.getElementById('drpcourtname1').value != "NL" && document.getElementById('drpcourtname1').value != "CI") {
                                if (document.getElementById('txtno1').value != "") {
                                    if (/\//.test(document.getElementById('txtno1').value)) {
                                        alert("/ not allowed in caseno");
                                        document.getElementById('txtno1').focus();
                                        return false;
                                    }
                                }
                            }
                        }
                        else {
                            if (document.getElementById('txtDiaryNo1').value == "") {
                                alert("please enter diary no.");
                                document.getElementById('txtDiaryNo1').focus();
                                return false;
                            }
                        }
                    }
                }
                if (document.getElementById('drpcourtname1').value != "SC") {
                    if (document.getElementById('divTCDT1').value == "1" && document.getElementById('drpcourtname1').value == "DT") {
                        document.getElementById('drptype1').value = "";
                    }
                    else if (document.getElementById('txtno1').value == "") {
                        alert("please enter matter no.");
                        document.getElementById('txtno1').focus();
                        return false;
                    }
                    if (document.getElementById('drpcourtname1').value != "NC" && document.getElementById('drpcourtname1').value != "NL" && document.getElementById('drpcourtname1').value != "CI") {
                        if (document.getElementById('txtno1').value != "") {
                            if (/\//.test(document.getElementById('txtno1').value)) {
                                alert("/ not allowed in caseno");
                                document.getElementById('txtno1').focus();
                                return false;
                            }
                        }
                    }
                }
                if (document.getElementById('drpYear1').value == "" || document.getElementById('drpYear1').value == "0") {
                    alert("please select matter year");
                    document.getElementById('drpYear1').focus();
                    return false;
                }
            }
        }
    }
    else {
        if (document.getElementById('drpcourtnameDC1').value == "") {
            alert("please Select the state.");
            document.getElementById('drpcourtnameDC1').focus();
            return false;
        }
        if (document.getElementById('drpdistrictcourtname1').value == "0") {
            alert("please select district");
            document.getElementById('drpdistrictcourtname1').focus();
            return false;
        }
        if (document.getElementById('drpcourtcomplexestb1').value == "") {
            alert("please select court complex / court establishment");
            document.getElementById('drpcourtcomplexestb1').focus();
            return false;
        }
        if (document.getElementById('drpcompestbcourt1').value == "") {
            alert("please select district court");
            document.getElementById('drpcompestbcourt1').focus();
            return false;
        }
        if (document.getElementById('drptype1').value == "") {
            alert("please select matter type");
            document.getElementById('drptype1').focus();
            return false;
        }
        if (document.getElementById('txtno1').value == "") {
            alert("please enter matter no.");
            document.getElementById('txtno1').focus();
            return false;
        }
        if (document.getElementById('drpcourtname1').value != "NC" && document.getElementById('drpcourtname1').value != "NL" && document.getElementById('drpcourtname1').value != "CI") {
            if (document.getElementById('txtno1').value != "") {
                if (/\//.test(document.getElementById('txtno1').value)) {
                    alert("/ not allowed in caseno");
                    document.getElementById('txtno1').focus();
                    return false;
                }
            }
        }
        if (document.getElementById('drpYear1').value == "0") {
            alert("please select matter year");
            document.getElementById('drpYear1').focus();
            return false;
        }
        var reracourt = document.getElementById("divReraCourt1").value;
        var reracasetype1 = document.getElementById("reracasetype1").value;
        var reracaseyear1 = document.getElementById("reracaseyear1").value;
        var reracasno1 = document.getElementById("reracasno1").value;
        var reraRefNo1 = document.getElementById("reraRefNo1").value;
        if (divSCHCDistrict1 == "") {
            alert("Select Court");
            return false;
        }
        if (reracourt == "") {
            alert("Select Court Name");
            return false;
        }
        if (reracourt == "HRRA") {
            if (reracasetype1 == "0") {
                alert("Select Case/Appeal Authority");
                return false;
            }
            if (reracasno1 == "0" || reracasno1 == "") {
                alert("Select Case/Appeal No");
                return false;
            }
            if (reracaseyear1 == "0") {
                alert("Select Case Year");
                return false;
            }
        }
        else {
            if (reraRefNo1 == "") {
                alert("Enter Case/Appeal No");
                return false;
            }
        }
    }
}
/*Validate dairy nimber*/
function validatediaryno() {
    alert(document.getElementById('txtDiaryNo1').value);
}
/*Hide SCDE div*/
function hiddivSCDE1() {
    document.getElementById('drptype1').value = "0";
    document.getElementById('txtno1').value = "";
    document.getElementById('drpYear1').value = "0";
    $("#divcaseno1").toggle();
    $("#divcasetype1").toggle();
    $("#divdiaryno1").hide();
    if (document.getElementById('divSCDECD1').value == "1") {
        $("#divcaseno1").hide();
        $("#divcasetype1").hide();
        $("#divdiaryno1").toggle();
    }
}
/*Add court name*/
function AddCourtName1(strcourttype) {
    $.ajax({
        type: "POST",
        url: "/AddCase/AddCourtNameByCourtType?courttype=" + strcourttype,
        dataType: "json",
        success: function (data) {
            $("#drpcourtname1").append("<option value='0'>-Select Court Name-</option>");
            $("#drpcourtnameDC1").append("<option value='0'>Select Your State / UT</option>");
            for (var i = 0; i < data.length; i++) {
                if (strcourttype != "3") {
                    $("#drpcourtname1").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
                else {
                    $("#drpcourtnameDC1").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            }
        },
        error: function (data) {
        }
    });
}
/*Dropdown court name for DC*/
function divdrpcourtnameDC1() {
    $("#drpdistrictcourtname1").empty();
    var selectedText = "";
    document.getElementById('Court1').style.display = 'none';
    document.getElementById('drpcourtcomplexestb1').style.display = 'none';
    document.getElementById('drpdistrictcourtname1').style.display = 'none';
    document.getElementById('drpcompestbcourt1').style.display = 'none';
    document.getElementById('lbldistrictname1').style.display = 'none';
    document.getElementById("savebtn1").style.display = "none";
    if (document.getElementById('drpcourtnameDC1').value != "0") {
        document.getElementById('drpdistrictcourtname1').style.display = 'block';
        document.getElementById('lbldistrictname1').style.display = 'block';
        var skillsSelect = document.getElementById("drpcourtnameDC1");
        var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
        document.getElementById('lbldistrictname1').innerHTML = "<center><h4>Selected: <span>" + selectedText + "</span> </h4></center><hr style='border:1px solid #e6cfcf;margin-top:10px; margin-bottom:0px;'>"
        $.ajax({
            type: "POST",
            url: "/AddCase/AddDistrictByCourt?courttype=" + document.getElementById('drpcourtnameDC1').value,
            dataType: "json",
            success: function (data) {
                $("#drpdistrictcourtname1").append("<option value='0'>Please Select District</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpdistrictcourtname1").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
}
/*Change district court*/
function divdistrictchange1() {
    document.getElementById('drpcourtcomplexestb1').style.display = 'none';
    document.getElementById('drpcompestbcourt1').style.display = 'none';
    document.getElementById("savebtn1").style.display = "none";
    if (document.getElementById('drpdistrictcourtname1').value != "0") {
        document.getElementById('drpcourtcomplexestb1').style.display = 'block';
        document.getElementById('drpcourtcomplexestb1').value = '';
        $.ajax({
            type: "POST",
            url: "/Firm/FillCourtComplexSTB",
            dataType: "json",
            success: function (data) {
                $("#drpcourtcomplexestb1").empty();
                $("#drpcourtcomplexestb1").append("<option value=''>Please Select</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpcourtcomplexestb1").append("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
}
/*Change dropdown for stb court*/
function drpcourtcompestbchange1() {
    var courtype = "";
    var districttype = "";
    var compesttype = "";
    $('#drpcompestbcourt1').empty();
    document.getElementById("savebtn1").style.display = "none";
    document.getElementById('drpcompestbcourt1').style.display = 'none';
    if (document.getElementById('drpcourtcomplexestb1').value != "") {
        document.getElementById('drpcompestbcourt1').style.display = 'block';
        document.getElementById('drpcompestbcourt1').value = '';
        courtype = document.getElementById('drpcourtnameDC1').value;
        districttype = document.getElementById('drpdistrictcourtname1').value;
        compesttype = document.getElementById('drpcourtcomplexestb1').value;
        $.ajax({
            type: "POST",
            url: "/AddCase/AddCourtComplexEstType?crttype=" + courtype + "&dsttype=" + districttype + "&compesttype=" + compesttype,
            dataType: "json",
            success: function (data) {
                $("#drpcompestbcourt1").append("<option value=''>Please Select District Court</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drpcompestbcourt1").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
}
/*Change dropdown*/
function drpcompestbcourtchange1() {
    var courtype = "";
    var districttype = "";
    var compesttype = "";
    var compestcourt = "";
    $('#drptype1').empty();
    document.getElementById("savebtn1").style.display = "none";
    if (document.getElementById('drpcompestbcourt1').value != "") {
        document.getElementById("savebtn1").style.display = "block";
        courtype = encodeURIComponent(document.getElementById('drpcourtnameDC1').value);
        districttype = encodeURIComponent(document.getElementById('drpdistrictcourtname1').value);
        compesttype = encodeURIComponent(document.getElementById('drpcourtcomplexestb1').value);
        compestcourt = encodeURIComponent(document.getElementById('drpcompestbcourt1').value);
        $.ajax({
            type: "POST",
            url: "/AddCase/AddDistrictCaseType?crttype=" + courtype + "&dsttype=" + districttype + "&compesttype=" + compesttype + "&compestcourt=" + compestcourt,
            dataType: "json",
            success: function (data) {
                $("#drptype1").append("<option value=''>Please Select Matter Type</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drptype1").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            },
            error: function (data) {
            }
        });
        $.ajax({
            type: "POST",
            url: "/firm/Addcaseyear?crtid=",
            dataType: "json",
            success: function (data) {
                $("#drpYear1").append("<option value='0'>Select Matter Year</option>");
                for (var i = 0; i < data.length; i++) {
                    var caseyearlength = data[i].caseyear;
                }
                startYear = new Date().getFullYear()
                for (var i = parseInt(startYear); i >= parseInt(caseyearlength); i--) {
                    $("#drpYear1").append("<option value='" + i + "'>" + i + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
}
/*Rera court implemnetations*/
function fn_reracasetype1(val) {
    if (val == "HRRA") {
        document.getElementById("divreracasetype1").style.display = "block";
        document.getElementById("divRefNo1").style.display = "block";
        document.getElementById("divRefNo1").style.display = "none";
        document.getElementById("divreracaseyear1").style.display = "block";
        fillReraCaseType1();
        fillYear1();
        document.getElementById("reraRefNo1").value = "";
    }
    else {
        document.getElementById("reracasetype1").value = "0";
        document.getElementById("reracaseyear1").value = "0";
        document.getElementById("divreracasetype1").style.display = "none";
        document.getElementById("reracasno1").value = "";
        document.getElementById("divRefNo1").style.display = "block";
        document.getElementById("divreracaseyear1").style.display = "none";
    }
}
/*bind rera court start*/
function fillReraCourt1() {
    var reracourt = "";
    $("#divReraCourt1 option").remove();
    $.ajax({
        type: "POST",
        url: "/AddCase/BindReraCourtType?reracourt=" + reracourt,
        dataType: "json",
        success: function (data) {
            $("#divReraCourt1").append("<option value='0'>Case/Appeal Authority</option>");
            for (var i = 0; i < data.length; i++) {
                $("#divReraCourt1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
//end
/*bind case type*/
function fillReraCaseType1() {
    var reracourt = document.getElementById("divReraCourt1").value;
    $("#reracasetype1 option").remove();
    $.ajax({
        type: "POST",
        url: "/AddCase/GetReraCourtCaseType?reracourt=" + reracourt,
        dataType: "json",
        success: function (data) {
            $("#reracasetype1").append("<option value='0'>Case/Appeal Authority</option>");
            for (var i = 0; i < data.length; i++) {
                $("#reracasetype1").append("<option value='" + data[i].casetypename + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*bind case year*/
function fillYear1() {
    var ctyear = "SC";
    $("#reracaseyear1 option").remove();
    $.ajax({
        type: "POST",
        url: "/firm/Addcaseyear?crtid=" + ctyear,
        dataType: "json",
        success: function (data) {
            $("#reracaseyear1").append("<option value='0'>Case Year</option>");
            for (var i = 0; i < data.length; i++) {
                var caseyearlength = data[i].caseyear;
            }
            startYear = new Date().getFullYear()
            for (var i = parseInt(startYear); i >= parseInt(caseyearlength); i--) {
                $("#reracaseyear1").append("<option value='" + i + "'>" + i + "</option>");
            }
        },
        error: function (data) {
        }
    });
}
/*Display SCH district div*/
function divSCHCDistrictdisplay1() {
    $('#labelcaseNo').contents().first()[0].textContent = 'Matter Number';
    document.getElementById('drpyearshow').style.display = "block";
    document.getElementById('information').style.display = "none";

    try {
   
        $("#txtsuffix1").val("");
        $("#divsuffix1").hide();
        ResetRevenue1();
        ResetReracourt1();
        document.getElementById('ReraCourtDiv1').style.display = 'none';
        document.getElementById('RevenueCourtDiv1').style.display = 'none';
        document.getElementById('HighCourt1').style.display = 'none';
        document.getElementById('DistrictCourt1').style.display = 'none';
        document.getElementById('drpcourtcomplexestb1').style.display = 'none';
        document.getElementById('drpdistrictcourtname1').style.display = 'none';
        document.getElementById('drpcompestbcourt1').style.display = 'none';
        document.getElementById('lbldistrictname1').innerHTML = "";
        $("#drpdcourtcnr1").val("");
        $("#drpdistrictcourtname1").val("");
        $('#drpcourtname1').empty();
        $('#drpcourtnameDC1').empty();
        $("#drpYear1").empty();
        $("#drptype1").empty();
        $("#drpNCBench1").empty();
        $("#divdiaryno1").hide();
        $("#divSCDE1").hide();
        $("#drpGoa1").val = "";
        document.getElementById('drpbench1').style.border = "unset";
        document.getElementById('drpside1').style.border = "unset";
        document.getElementById('divTNBench1').style.border = "unset";
        document.getElementById('divJKBench1').style.border = "unset";
        document.getElementById('divRHBench1').style.border = "unset";
        document.getElementById('divBHBench1').style.border = "unset";
        document.getElementById('divMPBench1').style.border = "unset";
        document.getElementById('divUPBench1').style.border = "unset";
        document.getElementById('divGHBench1').style.border = "unset";
        document.getElementById('drpNCBench1').style.border = "unset";
        document.getElementById('drpNCBench1').style.border = "unset";
        document.getElementById('drptype1').style.border = "unset";
        document.getElementById('drptype1').style.border = "unset";
        document.getElementById('drpYear1').style.border = "unset";
        document.getElementById('drpcourtnameDC1').style.border = "unset";
        document.getElementById('drpcourtcomplexestb1').style.border = "unset";
        document.getElementById('drpcompestbcourt1').style.border = "unset";
        document.getElementById('drptype1').style.border = "unset";
        document.getElementById('drpYear1').style.border = "unset";
        document.getElementById('divSCDECD1').value = "0";
        document.getElementById('txtDiaryNo1').value = "";
        document.getElementById('divcasetype1').style.display = "block";
        document.getElementById('divcaseno1').style.display = "block";
        document.getElementById('divRH1').style.display = "none";
        document.getElementById('divJK1').style.display = "none";
        document.getElementById('divNC1').style.display = "none";
        document.getElementById('savebtn1').style.display = "none";
        document.getElementById("divKA1").style.display = "none";
        document.getElementById('divMHGoa1').style.display = "none";
        document.getElementById('divTN1').style.display = "none";
        document.getElementById('divBH1').style.display = "none";
        document.getElementById('divMP1').style.display = "none";
        document.getElementById('divMHGoa1').style.display = "none";
        document.getElementById("divMH1").style.display = "none";
        document.getElementById('divUP1').style.display = "none";
        document.getElementById('divGH1').style.display = "none";
        document.getElementById('lblcourtname1').innerHTML = "";
        document.getElementById('Court1').style.display = "none";
        //for Rera court
        if (document.getElementById('divSCHCDistrict1').value == "2" || document.getElementById('divSCHCDistrict1').value == "3") {
            if (document.getElementById('divSCHCDistrict1').value == "2") {
                document.getElementById('cnrdivdata1').style.display = 'none';
                $("#lbllinkedcase1").text("LINK CASES FOR HIGH COURT TO DISTRICT COURT");
            }
            if (document.getElementById('divSCHCDistrict1').value == "3") {
                document.getElementById('cnrdivdata1').style.display = 'block';
                $("#lbllinkedcase1").text("Update District Court by CNR Number");
            }
        }
        else {
            document.getElementById('cnrdivdata1').style.display = 'none';
        }
        if (document.getElementById('divSCHCDistrict1').value == "1") {
            AddCourtName1(document.getElementById('divSCHCDistrict1').value);
            showaddingcasetype1();
            FillCasetypeDiary1();
        }
        else if (document.getElementById('divSCHCDistrict1').value == "2" || document.getElementById('divSCHCDistrict1').value == "4" || document.getElementById('divSCHCDistrict1').value == "5") {
            document.getElementById('HighCourt1').style.display = 'block';
            AddCourtName1(document.getElementById('divSCHCDistrict1').value);
        }
        else if (document.getElementById('divSCHCDistrict1').value == "3") {
            document.getElementById('DistrictCourt1').style.display = 'block';
            AddCourtName1('3');
        }
        else if (document.getElementById('divSCHCDistrict1').value == "6") {
            document.getElementById('RevenueCourtDiv1').style.display = 'block';
            BindRevenueYear1('6');
            BindRevenueCourt1();
        }
        //for Rera court
        else if (document.getElementById('divSCHCDistrict1').value == "7") {
            document.getElementById('ReraCourtDiv1').style.display = 'block';
            fillReraCourt1();
        }
    }
    catch (ex) {
        alert(ex.message);
    }
}
/*Add drt court*/
/*Open loader for casewatch*/
function openloadCW() {
    $("#myOverlayCW").css("display", "block");
}
/*Close loader for casewatch*/
function closeloadCW() {
    $("#myOverlayCW").css("display", "none");
}

var flagOff = 0;
function OpenAppealInformationOnSelect() {
    try {
        if (localStorage.getItem("ShowPopUpSession") === "ShowPopup" && document.getElementById('drpcourtname1').value === "CF") {
            $('#AppealModalInformation').modal({ show: true });
            localStorage.removeItem('ShowPopUpSession');
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }


}


function OpenAppealInformation() {
    $('#AppealModalInformation').modal({ show: true });
    flagOff += 1;

}

function closeModalAppeal() {
    $('#AppealModalInformation').modal('hide');
}
