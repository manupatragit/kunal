var iscnrrequest = requestpaged;
var mname = MatterName;
var mid = MatterId;
var sideIds = "";
var stampRegs = "";
var vBenchMH = "";
var cType = "";
$(document).ready(function () {
    $('#myOverlayRERH').hide();
    addtaskmember4();
    jQuery('#addtaskmember4,#teammemberss,#addtaskmemberManual').multiselect({
        columns: 1,
        search: true,
        selectAll: false
    });
    jQuery('#clearmember').click(function () {
        var $select = $("#addtaskmember4,#addtaskmemberManual").selectize();
        var selectize = $select[0].selectize;
        selectize.clear();
        selectize.clearOptions();
    });
    if (mid != null && mid != "" && mid != undefined) {
        $("#Modalmattername").val(mname).prop("readonly", true);;
        $("#mattersAdd").val(mname).prop("readonly", true);;
        $("#mattersRevnue").val(mname).prop("readonly", true);;
        $("#reraMatterName").val(mname).prop("readonly", true);;



        document.getElementById('addtaskmember4Block').style.display = "none";
        document.getElementById('teammemberssBlock').style.display = "none";
        document.getElementById('addtaskmemberManualBlock').style.display = "none";
    }
    else {
        $("#Modalmattername").val("").prop("readonly", false);;
        $("#mattersAdd").val("").prop("readonly", false);;
        $("#mattersRevnue").val("").prop("readonly", false);;
        $("#reraMatterName").val("").prop("readonly", false);;
        document.getElementById('addtaskmember4Block').style.display = "block";
        document.getElementById('teammemberssBlock').style.display = "block";
        document.getElementById('addtaskmemberManualBlock').style.display = "block";



    }

    // Add live update manually
    $(document).on('click', '#cnrCaseAdd', function () {

        // Ensure fcode, mid, and mname are defined
        if (typeof fcode === 'undefined' || typeof mid === 'undefined' || typeof mname === 'undefined') {
            console.error('Required variables (fcode, mid, mname) are not defined.');
            return;
        }

        // Create a hidden form dynamically to send data via POST
        var form = $('<form>', {
            method: 'POST',
            action: '/' + encodeURIComponent(fcode) + '/CW/LitigationAddLiveUpdate?type=1'
        });

        form.append($('<input>', {
            type: 'hidden',
            name: 'matterId',
            value: mid
        }));

        form.append($('<input>', {
            type: 'hidden',
            name: 'matterName',
            value: mname
        }));

        // Append form to body and submit
        $('body').append(form);
        form.submit();
    });


    FillCourtType1();
    CourtYear();
    /*Fill court type*/
    function FillCourtType1() {
        $.ajax({
            async: true,
            type: "POST",
            url: "/Firm/FillCourt",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var option = '<option value="">Select type</option>';
                $.each(response, function (i, a) {
                    option += '<option value="' + a["id"] + '" >  ' + a["courtname"] + '</option>';
                });
                option += '<option value="6" >Revenue Court</option>';
                option += '<option value="7" >RERA Court</option>';
                $("#divSCHCDistrict1").append(option);//End of foreach Loop
                if (iscnrrequest == "1") {
                    $("#divSCHCDistrict1").val("3");
                    $("#drpcourtname1").val("0");
                    $("#divSCHCDistrict1").attr("disabled", true);
                    cnrvalidation();

                } else {
                    $("#divSCHCDistrict1").val('');
                }
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.responseText);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.responseText);
            } //End of AJAX error function
        });
    }
});


function selectCourtType() {

    // $("#drptype1 option").remove();
    const selectElement = document.getElementById("drptype");

    // Check if the element exists
    if (selectElement) {
        // Loop through and remove all options
        while (selectElement.options.length > 0) {
            selectElement.remove(0);
        }
    }
    const selectElement1 = document.getElementById("drptypeBench");
    if (selectElement1) {
        // Loop through and remove all options
        while (selectElement1.options.length > 0) {
            selectElement1.remove(0);
        }
    }
    const selectElement2 = document.getElementById("drptypeMH");
    if (selectElement2) {
        // Loop through and remove all options
        while (selectElement2.options.length > 0) {
            selectElement2.remove(0);
        }
    }

    document.getElementById('matterNumberType').style.display = 'block';
    //document.getElementById('matterType').style.display = 'block';
    document.getElementById('OtherDetailsPannel').style.display = 'block';

    var vCourtType = document.getElementById("divSCHCDistrict1").value
    if (vCourtType == "1") {
        document.getElementById('PrimeCourt').style.display = "block";
        document.getElementById('AddaCourtArea').style.display = "none";
        document.getElementById('optionalCourtMatter').style.display = "none";
        document.getElementById('divSCDE1').style.display = 'block';
        document.getElementById('HighCourtType').style.display = 'none';
        document.getElementById('NoDocBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'none';

        document.getElementById('WithoutBenchBenchType').style.display = 'block';
        document.getElementById('MhSideType').style.display = 'none';
        document.getElementById('divDistrict').style.display = 'none';
        document.getElementById('NormalcaseType').style.display = 'block';
        document.getElementById('ConsumercaseType').style.display = 'none';
        document.getElementById("ConsumerDistrictState").style.display = "none";
        document.getElementById("divDtDairyBench").style.display = "none";
        document.getElementById("DaryNumberType").style.display = "none";
        document.getElementById("MemberFortempCourt").style.display = "none"
        document.getElementById("RevnuewArea").style.display = "none";
        document.getElementById("MaincaseCourt").style.display = "block";
        document.getElementById("optionalCourt").style.display = "none";
        document.getElementById("divreracasetype1").style.display = "none";
        document.getElementById("RevnuewAreaRERH").style.display = "none";


        //document.getElementById('OtherDetailsPannel').style.display = "none";

        FillCasetypeDiary1();
        HideDairyAndCaseType();

    }
    else if (vCourtType == "2") {
        document.getElementById('PrimeCourt').style.display = "block";
        document.getElementById('AddaCourtArea').style.display = "none";
        document.getElementById('optionalCourtMatter').style.display = "none";
        AddCourtName();
        document.getElementById('divSCDE1').style.display = 'none';
        document.getElementById('HighCourtType').style.display = 'block';
        document.getElementById('DaryNumberType').style.display = 'none';
        document.getElementById('MhSideType').style.display = 'none';
        document.getElementById('divDistrict').style.display = 'none';
        document.getElementById('NormalcaseType').style.display = 'block';
        document.getElementById('ConsumercaseType').style.display = 'none';
        document.getElementById("ConsumerDistrictState").style.display = "none";
        document.getElementById("divDtDairyBench").style.display = "none";
        document.getElementById("DaryNumberType").style.display = "none";
        document.getElementById("MemberFortempCourt").style.display = "none"
        document.getElementById("RevnuewArea").style.display = "none";
        document.getElementById("MaincaseCourt").style.display = "block";
        document.getElementById("optionalCourt").style.display = "none";

        document.getElementById("divreracasetype1").style.display = "none";

        document.getElementById("RevnuewAreaRERH").style.display = "none";
        // document.getElementById('OtherDetailsPannel').style.display = "none";



    }
    else if (vCourtType == "4") {
        document.getElementById('PrimeCourt').style.display = "block";
        document.getElementById('AddaCourtArea').style.display = "none";
        document.getElementById('optionalCourtMatter').style.display = "none";

        AddCourtName();
        document.getElementById('divSCDE1').style.display = 'none';
        document.getElementById('HighCourtType').style.display = 'block';
        document.getElementById('DaryNumberType').style.display = 'none';
        document.getElementById('MhSideType').style.display = 'none';
        document.getElementById('divDistrict').style.display = 'none';
        document.getElementById('WithoutBenchBenchType').style.display = 'block';
        document.getElementById('MHBenchType').style.display = 'none';
        document.getElementById('NoDocBenchType').style.display = 'none';
        document.getElementById('divDistrict1').style.display = "none";
        document.getElementById('divcourtcomplexestb1').style.display = "none";
        document.getElementById('divcourtcomplexestb1').style.display = "none";
        document.getElementById('NormalcaseType').style.display = 'block';

        document.getElementById('ConsumercaseType').style.display = 'none';
        document.getElementById("ConsumerDistrictState").style.display = "none";
        document.getElementById("divDtDairyBench").style.display = "none";
        document.getElementById("DaryNumberType").style.display = "none";
        document.getElementById("MemberFortempCourt").style.display = "none"
        document.getElementById("RevnuewArea").style.display = "none";
        document.getElementById("MaincaseCourt").style.display = "block";
        document.getElementById("optionalCourt").style.display = "none";
        document.getElementById("divreracasetype1").style.display = "none";
        document.getElementById("RevnuewAreaRERH").style.display = "none";





    }
    else if (vCourtType == "3") {
        AddCourtName();
        document.getElementById('AddaCourtArea').style.display = "none";
        document.getElementById('PrimeCourt').style.display = "block";
        document.getElementById('divSCDE1').style.display = 'none';
        document.getElementById('optionalCourtMatter').style.display = "none";

        document.getElementById('HighCourtType').style.display = 'none';
        document.getElementById('DaryNumberType').style.display = 'none';
        document.getElementById('MhSideType').style.display = 'none';
        document.getElementById('divDistrict').style.display = 'block';
        document.getElementById('WithoutBenchBenchType').style.display = 'block';
        document.getElementById('MHBenchType').style.display = 'none';
        document.getElementById('NoDocBenchType').style.display = 'none';
        document.getElementById('divDistrict1').style.display = "none";
        document.getElementById('divcourtcomplexestb1').style.display = "none";
        document.getElementById('divcourtcomplexestb1').style.display = "none";
        document.getElementById('NormalcaseType').style.display = 'block';
        document.getElementById('ConsumercaseType').style.display = 'none';
        document.getElementById("ConsumerDistrictState").style.display = "none";
        document.getElementById("divDtDairyBench").style.display = "none";
        document.getElementById("DaryNumberType").style.display = "none";
        document.getElementById("MemberFortempCourt").style.display = "none";
        document.getElementById("RevnuewArea").style.display = "none";
        document.getElementById("MaincaseCourt").style.display = "block";
        document.getElementById("optionalCourt").style.display = "none";

        document.getElementById("divreracasetype1").style.display = "none";
        document.getElementById("RevnuewAreaRERH").style.display = "none";
    }

    else if (vCourtType == "5") {
        AddCourtName();
        document.getElementById('PrimeCourt').style.display = "none";
        document.getElementById('AddaCourtArea').style.display = "block";
        document.getElementById('HighCourtType').style.display = "block";
        document.getElementById("MemberFortempCourt").style.display = "block";
        document.getElementById("RevnuewArea").style.display = "none";
        document.getElementById('optionalCourtMatter').style.display = "none";
        document.getElementById("MaincaseCourt").style.display = "none";
        document.getElementById("optionalCourt").style.display = "block";
        document.getElementById("RevnuewAreaRERH").style.display = "none";
        document.getElementById("divreracasetype1").style.display = "none";
    }
    else if (vCourtType == "6") {
        BindRevenueCourt1();

        document.getElementById('PrimeCourt').style.display = "none";
        document.getElementById('AddaCourtArea').style.display = "none";
        document.getElementById('HighCourtType').style.display = "block";
        document.getElementById("MemberFortempCourt").style.display = "block";
        document.getElementById("RevnuewArea").style.display = "none";
        document.getElementById('optionalCourtMatter').style.display = "none";
        document.getElementById("MaincaseCourt").style.display = "none";
        document.getElementById("optionalCourt").style.display = "block";
        document.getElementById("divreracasetype1").style.display = "none";
        document.getElementById("RevnuewAreaRERH").style.display = "none";
    }

    else if (vCourtType == "7") {
        fillReraCourt1();

        document.getElementById('PrimeCourt').style.display = "none";
        document.getElementById('AddaCourtArea').style.display = "none";
        document.getElementById('HighCourtType').style.display = "block";
        document.getElementById("MemberFortempCourt").style.display = "block";
        document.getElementById("RevnuewArea").style.display = "none";
        document.getElementById('optionalCourtMatter').style.display = "block";
        document.getElementById("MaincaseCourt").style.display = "none";
        document.getElementById("optionalCourt").style.display = "block";
        document.getElementById("divreracasetype1").style.display = "block";
        document.getElementById("RevnuewAreaRERH").style.display = "none";
    }


}





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
            $("#divSCDECD1").append("<option value=''>Select type</option>");

            $.each(response, function (i, a) {
                option = '<option value="' + a["id"] + '" >  ' + a["name"] + '</option>';
                $("#divSCDECD1").append(option);
            }); //End of foreach Loop
            CourtCaseType();
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}

function CourtCaseType() {
    $("#drptype").empty();
    var vCourtType = document.getElementById("divSCHCDistrict1").value;
    var type = document.getElementById("divSCDECD1").value;
    if (vCourtType == "1" && type == "0") {
        var court = "SC";
        $.ajax({
            type: "POST",
            url: "/AddCase/Addcasetype?crtid=" + court + "&courttitle=&side=",
            dataType: "json",
            success: function (data) {
                $("#drptype").append("<option value='0'>Select Matter Type-</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
    else if (vCourtType == "2") {
        vCourtId = document.getElementById('drpcourtname1').value;
        vBench = document.getElementById('divBench').value;
        if (vCourtId != "MH") {
            $.ajax({
                type: "POST",
                url: "/AddCase/Addcasetype?crtid=" + vCourtId + "&courttitle=" + "" + "&bench=" + vBench + "&side=",
                dataType: "json",
                success: function (data) {
                    $("#drptypeBench").append("<option value='0'>-Select Matter Type-</option>");
                    $("#drptype").append("<option value='0'>-Select Matter Type-</option>");

                    for (var i = 0; i < data.length; i++) {
                        if (vBench != "" && vBench != undefined && vBench != null)
                            $("#drptypeBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                        else
                            $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                    }
                },
                error: function (data) {
                }
            });
        }
        else if (vCourtId == "MH" && vBench == "Goa") {
            $.ajax({
                type: "POST",
                url: "/AddCase/Addcasetype?crtid=" + vCourtId + "&courttitle=" + vBench + "&bench=" + "" + "&side=",
                dataType: "json",
                success: function (data) {
                    $("#drptypeBench").append("<option value='0'>-Select Matter Type-</option>");
                    $("#drptype").append("<option value='0'>-Select Matter Type-</option>");

                    for (var i = 0; i < data.length; i++) {
                        if (vBench != "" && vBench != undefined && vBench != null)
                            $("#drptypeBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                        else
                            $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                    }
                },
                error: function (data) {
                }
            });
        }


    }
    else if (vCourtType == "4") {

        vCourtId = document.getElementById('drpcourtname1').value;
        vBench = document.getElementById('divBench').value;
        $.ajax({
            type: "POST",
            url: "/AddCase/Addcasetype?crtid=" + vCourtId + "&courttitle=" + "" + "&bench=" + vBench + "&side=",
            dataType: "json",
            success: function (data) {
                $("#drptypeBench").append("<option value='0'>-Select Matter Type-</option>");
                $("#drptype").append("<option value='0'>-Select Matter Type-</option>");

                for (var i = 0; i < data.length; i++) {
                    if (vBench != "" && vBench != undefined && vBench != null)
                        $("#drptypeBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                    else
                        $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                }
            },
            error: function (data) {
            }
        });

    }

}


function HideDairyAndCaseType() {
    var vCourtType = document.getElementById("divSCHCDistrict1").value;
    var type = document.getElementById("divSCDECD1").value;
    if (vCourtType == "1" && type == "0") {
        document.getElementById('NormalcaseType').style.display = 'block';
        document.getElementById('ConsumercaseType').style.display = 'none';
        document.getElementById('matterNumberType').style.display = 'block';
        // document.getElementById('matterType').style.display = 'block';
        document.getElementById('DaryNumberType').style.display = 'none';
        document.getElementById('NoDocBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'none';

        document.getElementById('WithoutBenchBenchType').style.display = 'block';
        document.getElementById('MhSideType').style.display = 'none';
        document.getElementById("ConsumerDistrictState").style.display = "none";
        document.getElementById('divDtDairyBench').style.display = 'none'

        CourtCaseType1("");

    }
    else if (vCourtType == "1" && type == "1") {
        document.getElementById('NormalcaseType').style.display = 'block';
        document.getElementById('ConsumercaseType').style.display = 'none';
        document.getElementById('matterNumberType').style.display = 'none';
        //document.getElementById('matterType').style.display = 'none';
        document.getElementById('DaryNumberType').style.display = 'block';
        document.getElementById('NoDocBenchType').style.display = 'none';

        document.getElementById('WithoutBenchBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'none';
        document.getElementById('MhSideType').style.display = 'none';
        document.getElementById("ConsumerDistrictState").style.display = "none";
        document.getElementById('divDtDairyBench').style.display = 'none'


    }
    else if (vCourtType == "2") {
        document.getElementById('NormalcaseType').style.display = 'block';
        document.getElementById('ConsumercaseType').style.display = 'none';
        document.getElementById('matterNumberType').style.display = 'block';
        // document.getElementById('matterType').style.display = 'block';
        document.getElementById('DaryNumberType').style.display = 'none';
        document.getElementById('NoDocBenchType').style.display = 'block';
        document.getElementById('WithoutBenchBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'none';
        document.getElementById('MhSideType').style.display = 'none';
        document.getElementById("ConsumerDistrictState").style.display = "none";
        document.getElementById('divDtDairyBench').style.display = 'none'







    }
    else if (document.getElementById("divSCHCDistrict1").value == "4" && type == "1" && document.getElementById("drpcourtname1").value == "DT") {
        document.getElementById('NormalcaseType').style.display = 'block';
        document.getElementById('ConsumercaseType').style.display = 'none';
        document.getElementById('matterNumberType').style.display = 'none';
        //document.getElementById('matterType').style.display = 'none';
        document.getElementById('DaryNumberType').style.display = 'block';
        document.getElementById('NoDocBenchType').style.display = 'none';
        document.getElementById('divDtDairyBench').style.display = 'block'
        document.getElementById('WithoutBenchBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'none';
        document.getElementById('MhSideType').style.display = 'none';
        document.getElementById("ConsumerDistrictState").style.display = "none";
        GetBenchTypeDt();

    }
    else if (document.getElementById("divSCHCDistrict1").value == "4" && type == "0") {
        document.getElementById('NormalcaseType').style.display = 'block';
        document.getElementById('ConsumercaseType').style.display = 'none';
        document.getElementById('matterNumberType').style.display = 'block';
        // document.getElementById('matterType').style.display = 'block';
        document.getElementById('divDtDairyBench').style.display = 'none'

        document.getElementById('DaryNumberType').style.display = 'none';
        document.getElementById('NoDocBenchType').style.display = 'block';
        document.getElementById('WithoutBenchBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'none';
        document.getElementById('MhSideType').style.display = 'none';
        document.getElementById("ConsumerDistrictState").style.display = "none";
        GetBenchTypeDt();
    }

}


function GetBenchTypeDt() {
    document.getElementById('NormalcaseType').style.display = 'block';
    document.getElementById('ConsumercaseType').style.display = 'none';
    if (document.getElementById('divSCDECD1').value == "1") {
        $.ajax({
            type: "POST",
            url: "/Firm/FillBenchType?crtid=" + document.getElementById("drpcourtname1").value,
            dataType: "json",
            success: function (data) {
                $("#divBenchDt").empty();
                if (data.length > 0) {
                    document.getElementById('NoDocBenchType').style.display = 'none';
                    document.getElementById('WithoutBenchBenchType').style.display = 'none';
                    document.getElementById('MHBenchType').style.display = 'none';
                    document.getElementById('MhSideType').style.display = 'none';


                    $("#divBenchDt").append("<option value=''>Select Bench / Type</option>");
                    for (var i = 0; i < data.length; i++) {
                        $("#divBenchDt").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                    }
                    $("#divBenchDt").val(vBenchMH);
                }

            },
            error: function (data) {
            }
        });
    }
    else {
        if (document.getElementById("drpcourtname1").value == "RC") {

            $.ajax({
                type: "POST",
                url: "/AddCase/AddBenchtype?bench=" + document.getElementById("drpcourtname1").value,
                dataType: "json",
                success: function (data) {
                    $("#divBench").empty();
                    if (data.length > 0) {
                        document.getElementById('NoDocBenchType').style.display = 'block';
                        document.getElementById('WithoutBenchBenchType').style.display = 'none';
                        document.getElementById('MHBenchType').style.display = 'none';
                        document.getElementById('MhSideType').style.display = 'none';


                        $("#divBench").append("<option value=''>Select Bench / Type</option>");
                        for (var i = 0; i < data.length; i++) {

                            $("#divBench").append(
                                `<option value="${data[i].casetype.replace(/#/g, '@$!')}">${data[i].casetypename}</option>`
                            );
                        }
                        $("#divBench").val(vBenchMH);
                    }
                    else {
                        CourtCaseType();
                        document.getElementById('WithoutBenchBenchType').style.display = 'block';
                        document.getElementById('NoDocBenchType').style.display = 'none';
                        document.getElementById('MHBenchType').style.display = 'none';
                        document.getElementById('MhSideType').style.display = 'none';


                    }

                },
                error: function (data) {
                }
            });
        } else {
            $.ajax({
                type: "POST",
                url: "/Firm/FillBenchType?crtid=" + document.getElementById("drpcourtname1").value,
                dataType: "json",
                success: function (data) {
                    $("#divBench").empty();
                    if (data.length > 0) {
                        document.getElementById('NoDocBenchType').style.display = 'block';
                        document.getElementById('WithoutBenchBenchType').style.display = 'none';
                        document.getElementById('MHBenchType').style.display = 'none';
                        document.getElementById('MhSideType').style.display = 'none';


                        $("#divBench").append("<option value=''>Select Bench / Type</option>");
                        for (var i = 0; i < data.length; i++) {
                            $("#divBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                        }
                        $("#divBench").val(vBenchMH);
                    }
                    else {
                        CourtCaseType();
                        document.getElementById('WithoutBenchBenchType').style.display = 'block';
                        document.getElementById('NoDocBenchType').style.display = 'none';
                        document.getElementById('MHBenchType').style.display = 'none';
                        document.getElementById('MhSideType').style.display = 'none';


                    }

                },
                error: function (data) {
                }
            });
        }

    }

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


function GetCaseYear() {
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
}


function AddCourtName() {
    $("#drpcourtname1").empty();
    var strcourttype = document.getElementById("divSCHCDistrict1").value;
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

function GetBench() {
    vCourtType = document.getElementById("divSCHCDistrict1").value;
    document.getElementById("drpcourtname1").value == "RERH" ? document.getElementById("optionalCourt").style.display = "none" : "";
    document.getElementById("drpcourtname1").value == "RELK" ? document.getElementById("optionalCourt").style.display = "block" : "";
    document.getElementById("drpcourtname1").value == "RERH" ? document.getElementById("MaincaseCourt").style.display = "block" : "";
    document.getElementById("drpcourtname1").value == "RELK" ? document.getElementById("MaincaseCourt").style.display = "none" : "";
    document.getElementById("ConsumerDistrictState").style.display = "none";
    document.getElementById("divDtDairyBench").style.display = "none";
    document.getElementById("RevnuewAreaRERH").style.display = "none";
    document.getElementById("RevnuewArea").style.display = "none";
    if (vCourtType == "4") {


        var courtid = document.getElementById("drpcourtname1").value;

        if (courtid == "CF") {
            document.getElementById("divSCDE1").style.display = "none";
            document.getElementById('NormalcaseType').style.display = 'none';
            document.getElementById('NoDocBenchType').style.display = "none";
            document.getElementById('MHBenchType').style.display = "none";
            document.getElementById('WithoutBenchBenchType').style.display = "none";


            document.getElementById('ConsumercaseType').style.display = 'block';
            $.ajax({
                type: "POST",
                url: "/Firm/FillBenchType?crtid=" + courtid,
                dataType: "json",
                success: function (data) {
                    $("#CFBench1").empty();
                    if (data.length > 0) {
                        //document.getElementById('NoDocBenchType').style.display = 'none';
                        //document.getElementById('WithoutBenchBenchType').style.display = 'none';
                        //document.getElementById('MHBenchType').style.display = 'none';
                        //document.getElementById('MhSideType').style.display = 'none';


                        $("#CFBench1").append("<option value=''>Select Bench / Type</option>");
                        for (var i = 0; i < data.length; i++) {
                            $("#CFBench1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                        }
                        $("#CFBench1").val(vBenchMH);
                    }
                },
                error: function (data) {
                }
            });

        }

        else if (courtid == "DT") {
            document.getElementById("divSCDE1").style.display = "block";
            FillCasetypeDiary1();

        }
        else if (courtid == "OERC") {
            document.getElementById("divSCDE1").style.display = "none";
            document.getElementById('WithoutBenchBenchType').style.display = 'none';
            document.getElementById('NoDocBenchType').style.display = 'none';
            document.getElementById('NormalcaseType').style.display = 'block';
            document.getElementById('ConsumercaseType').style.display = 'none';
            document.getElementById('DaryNumberType').style.display = 'none';
            document.getElementById('matterNumberType').style.display = 'block';



        }
        else {
            document.getElementById("divSCDE1").style.display = "none";

            document.getElementById('NormalcaseType').style.display = 'block';
            document.getElementById('ConsumercaseType').style.display = 'none';
            if (document.getElementById("drpcourtname1").value == "RC") {

                $.ajax({
                    type: "POST",
                    url: "/AddCase/AddBenchtype?bench=" + document.getElementById("drpcourtname1").value,
                    dataType: "json",
                    success: function (data) {
                        $("#divBench").empty();
                        if (data.length > 0) {
                            document.getElementById('NoDocBenchType').style.display = 'block';
                            document.getElementById('WithoutBenchBenchType').style.display = 'none';
                            document.getElementById('MHBenchType').style.display = 'none';
                            document.getElementById('MhSideType').style.display = 'none';


                            $("#divBench").append("<option value=''>Select Bench / Type</option>");
                            for (var i = 0; i < data.length; i++) {

                                $("#divBench").append(
                                    `<option value="${data[i].casetype.replace(/#/g, '@$!')}">${data[i].casetypename}</option>`
                                );
                            }
                            $("#divBench").val(vBenchMH);
                        }
                        else {
                            CourtCaseType();
                            document.getElementById('WithoutBenchBenchType').style.display = 'block';
                            document.getElementById('NoDocBenchType').style.display = 'none';
                            document.getElementById('MHBenchType').style.display = 'none';
                            document.getElementById('MhSideType').style.display = 'none';


                        }

                    },
                    error: function (data) {
                    }
                });
            }
            else {
                $.ajax({
                    type: "POST",
                    url: "/Firm/FillBenchType?crtid=" + courtid,
                    dataType: "json",
                    success: function (data) {
                        $("#divBench").empty();
                        if (data.length > 0) {
                            document.getElementById('NoDocBenchType').style.display = 'block';
                            document.getElementById('WithoutBenchBenchType').style.display = 'none';
                            document.getElementById('MHBenchType').style.display = 'none';
                            document.getElementById('MhSideType').style.display = 'none';


                            $("#divBench").append("<option value=''>Select Bench / Type</option>");
                            for (var i = 0; i < data.length; i++) {
                                $("#divBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                            }
                            $("#divBench").val(vBenchMH);
                        }
                        else {
                            CourtCaseType();
                            document.getElementById('WithoutBenchBenchType').style.display = 'block';
                            document.getElementById('NoDocBenchType').style.display = 'none';
                            document.getElementById('MHBenchType').style.display = 'none';
                            document.getElementById('MhSideType').style.display = 'none';


                        }

                    },
                    error: function (data) {
                    }
                });
            }


        }

    }
    else if (vCourtType == "6") {
        var courtid = document.getElementById("drpcourtname1").value;
        // Show/hide revenue areas based on court type
        if (courtid == 'RERH') {
            document.getElementById("RevnuewArea").style.display = "none";
            document.getElementById("RevnuewAreaRERH").style.display = "block";
            BindRevenueJanpadbyCourt();
            BindRevenueTahsilbyCourt();
        } else if (courtid == 'RELK') {
            document.getElementById("RevnuewArea").style.display = "block";
            document.getElementById("RevnuewAreaRERH").style.display = "none";
            BindRevenueMandal1();
            /*     BindRevenueMandal1();*/
        }
    }
    else if (vCourtType == "7") {
        var benchType = document.getElementById('drpcourtname1').value;

        if (benchType == "HRRA") {
            fillReraCaseType1()
            document.getElementById('divreracasetype1').style.display = 'block';
            document.getElementById('NonCasetypeRera').style.display = 'none';
            document.getElementById("reracasno1").setAttribute("type", "number");
            document.getElementById("reracasetype1").parentElement.style.display = "block";
            document.getElementById("reracaseyear1").parentElement.style.display = "block";
        }
        else if (benchType == "MHRERA") {
            document.getElementById("reracasetype1").parentElement.style.display = "none";
            document.getElementById("reracaseyear1").parentElement.style.display = "none";
            document.getElementById('divreracasetype1').style.display = 'block';
            document.getElementById('NonCasetypeRera').style.display = 'none';
            document.getElementById("reracasno1").setAttribute("type", "text");
        }
        else {
            document.getElementById('NonCasetypeRera').style.display = 'block';
            document.getElementById('divreracasetype1').style.display = 'none';
            document.getElementById("reracasno1").setAttribute("type", "number");
        }
    }
    else {
        document.getElementById('NormalcaseType').style.display = 'block';
        document.getElementById('ConsumercaseType').style.display = 'none';
        var courtid = document.getElementById("drpcourtname1").value;
        $.ajax({
            type: "POST",
            url: "/Firm/FillBenchType?crtid=" + courtid,
            dataType: "json",
            success: function (data) {
                $("#divBench").empty();
                if (data.length > 0) {
                    document.getElementById('NoDocBenchType').style.display = 'block';
                    document.getElementById('WithoutBenchBenchType').style.display = 'none';
                    document.getElementById('MHBenchType').style.display = 'none';
                    document.getElementById('MhSideType').style.display = 'none';


                    $("#divBench").append("<option value=''>Select Bench / Type</option>");
                    for (var i = 0; i < data.length; i++) {
                        $("#divBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                    }
                    $("#divBench").val(vBenchMH);
                }
                else {
                    CourtCaseType();
                    document.getElementById('WithoutBenchBenchType').style.display = 'block';
                    document.getElementById('NoDocBenchType').style.display = 'none';
                    document.getElementById('MHBenchType').style.display = 'none';
                    document.getElementById('MhSideType').style.display = 'none';


                }

            },
            error: function (data) {
            }
        });
    }

}

function ChangeDuringGetData() {
    vBenchMH = "";
    var vBench = document.getElementById('divBench').value;
    vBenchMH = document.getElementById('divBench').value;

    var courtid = document.getElementById("drpcourtname1").value;

    if (courtid == "MH" && vBench != "Goa") {
        GetBenchMH(vBenchMH);


        document.getElementById('NoDocBenchType').style.display = 'none';
        document.getElementById('WithoutBenchBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'block';
        document.getElementById('MhSideType').style.display = 'block';
        GetSide(vBenchMH);

    }
    else {
        CourtCaseType1(vBenchMH);
        document.getElementById('NoDocBenchType').style.display = 'block';
        document.getElementById('WithoutBenchBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'none';
        document.getElementById('MhSideType').style.display = 'none';

    }

}

function ChangeDuringGetData1() {
    vBenchMH = "";
    var vBench = document.getElementById('divBench1').value;
    vBenchMH = document.getElementById('divBench1').value;

    var courtid = document.getElementById("drpcourtname1").value;

    if (courtid == "MH" && vBench != "Goa") {
        document.getElementById('NoDocBenchType').style.display = 'none';
        document.getElementById('WithoutBenchBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'block';
        document.getElementById('MhSideType').style.display = 'block';
        GetSide(vBench);

    }
    else {
        GetBench();
        document.getElementById('NoDocBenchType').style.display = 'block';
        document.getElementById('WithoutBenchBenchType').style.display = 'none';
        document.getElementById('MHBenchType').style.display = 'none';
        document.getElementById('MhSideType').style.display = 'none';
        CourtCaseType1(vBenchMH);

    }

}




function GetBenchMH(val) {
    var courtid = document.getElementById("drpcourtname1").value;
    $.ajax({
        type: "POST",
        url: "/Firm/FillBenchType?crtid=" + courtid,
        dataType: "json",
        success: function (data) {
            $("#divBench1").empty();
            if (data.length > 0) {
                $("#divBench1").append("<option value=''>Select Bench / Type</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#divBench1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                }
                $("#divBench1").val(val);
            }
            else {
            }

        },
        error: function (data) {
        }
    });
}



function GetSide(benchid) {
    $("#drpside1").empty();
    document.getElementById('drpside1').innerHtml = "";
    $("#drpside1").empty;
    $.ajax({
        type: "POST",
        url: "/AddCase/GetSide?benchid=" + benchid + "&court=" + "MH",
        dataType: "json",
        success: function (data) {
            $("#drpside1").append("<option value='0'>-Select Side-</option>");
            for (var i = 0; i < data.length; i++) {
                $("#drpside1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
            FillStampRegister();
        },
        error: function (data) {
        }
    });
}


function FillStampRegister() {
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

function CourtCaseType1(vbench) {
    $("#drptype").empty();
    var vCourtType = document.getElementById("divSCHCDistrict1").value;
    var type = document.getElementById("divSCDECD1").value;
    if (vCourtType == "1" && type == "0") {
        var court = "SC";
        $.ajax({
            type: "POST",
            url: "/AddCase/Addcasetype?crtid=" + court + "&courttitle=&side=",
            dataType: "json",
            success: function (data) {
                $("#drptype").append("<option value='0'>-Select Matter Type-</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
    else if (vCourtType == "2") {
        vCourtId = document.getElementById('drpcourtname1').value;
        vBench = vbench;
        if (vCourtId != "MH") {
            $.ajax({
                type: "POST",
                url: "/AddCase/Addcasetype?crtid=" + vCourtId + "&courttitle=" + "" + "&bench=" + vBench + "&side=",
                dataType: "json",
                success: function (data) {
                    $("#drptypeBench").append("<option value='0'>-Select Matter Type-</option>");
                    $("#drptype").append("<option value='0'>-Select Matter Type-</option>");

                    for (var i = 0; i < data.length; i++) {
                        if (vBench != "" && vBench != undefined && vBench != null)
                            $("#drptypeBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                        else
                            $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                    }
                },
                error: function (data) {
                }
            });
        }
        else if (vCourtId == "MH" && vBench == "Goa") {
            $.ajax({
                type: "POST",
                url: "/AddCase/Addcasetype?crtid=" + vCourtId + "&courttitle=" + vBench + "&bench=" + "" + "&side=",
                dataType: "json",
                success: function (data) {
                    $("#drptypeBench").append("<option value='0'>-Select Matter Type-</option>");
                    $("#drptype").append("<option value='0'>-Select Matter Type-</option>");

                    for (var i = 0; i < data.length; i++) {
                        if (vBench != "" && vBench != undefined && vBench != null)
                            $("#drptypeBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                        else
                            $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                    }
                },
                error: function (data) {
                }
            });
        }

    }

    else if (vCourtType == "4") {

        vCourtId = document.getElementById('drpcourtname1').value;
        vBench = vbench;
        $("#drptypeBench").empty();
        $("#drptype").empty();
        $.ajax({
            type: "POST",
            url: "/AddCase/Addcasetype?crtid=" + vCourtId + "&courttitle=" + "" + "&bench=" + vBench + "&side=",
            dataType: "json",
            success: function (data) {
                if (vBench != "" && vBench != undefined && vBench != null)
                    $("#drptypeBench").append("<option value='0'>-Select Matter Type-</option>");
                else;
                $("#drptype").append("<option value='0'>-Select Matter Type-</option>");
                for (var i = 0; i < data.length; i++) {
                    if (vBench != "" && vBench != undefined && vBench != null)
                        $("#drptypeBench").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
                    else
                        $("#drptype").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");

                }
            },
            error: function (data) {
            }
        });

    }

}


function GetMhcaseType() {
    var bench = document.getElementById("divBench1").value;
    var side = document.getElementById("drpside1").value;
    $("#drptypeMH").empty();
    $.ajax({
        type: "POST",
        url: "/AddCase/Addcasetype?crtid=" + "MH" + "&courttitle=" + "" + "&bench=" + bench + "&side=" + side,
        dataType: "json",
        success: function (data) {
            $("#drptypeMH").append("<option value='0'>-Select Matter Type-</option>");
            for (var i = 0; i < data.length; i++) {
                $("#drptypeMH").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}


function divdrpcourtnameDC1() {
    $("#drpdistrictcourtname1").empty();
    var selectedText = "";
    document.getElementById('divcourtcomplexestb1').style.display = 'none';
    document.getElementById("divdrpcompestbcourt1").style.display = "none";
    if (document.getElementById('drpcourtnameDC1').value != "0") {
        document.getElementById('divDistrict1').style.display = 'block';
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

function divdistrictchange1() {
    document.getElementById("divdrpcompestbcourt1").style.display = "none";
    if (document.getElementById('drpdistrictcourtname1').value != "0") {
        document.getElementById('divcourtcomplexestb1').style.display = 'block';
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


/*Change court dropdown*/
function drpcourtcompestbchange1() {
    var courtype = "";
    var districttype = "";
    var compesttype = "";
    $('#drpcompestbcourt1').empty();
    document.getElementById('divdrpcompestbcourt1').style.display = 'none';
    if (document.getElementById('drpcourtcomplexestb1').value != "") {
        document.getElementById('divdrpcompestbcourt1').style.display = 'block';
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

function drpcompestbcourtchange1() {
    var courtype = "";
    var districttype = "";
    var compesttype = "";
    var compestcourt = "";
    $('#drptype').empty();
    if (document.getElementById('drpcompestbcourt1').value != "") {
        courtype = encodeURIComponent(document.getElementById('drpcourtnameDC1').value);
        districttype = encodeURIComponent(document.getElementById('drpdistrictcourtname1').value);
        compesttype = encodeURIComponent(document.getElementById('drpcourtcomplexestb1').value);
        compestcourt = encodeURIComponent(document.getElementById('drpcompestbcourt1').value);
        $.ajax({
            type: "POST",
            url: "/AddCase/AddDistrictCaseType?crttype=" + courtype + "&dsttype=" + districttype + "&compesttype=" + compesttype + "&compestcourt=" + compestcourt,
            dataType: "json",
            success: function (data) {
                $("#drptype").append("<option value=''>Please Select Matter Type</option>");
                for (var i = 0; i < data.length; i++) {
                    $("#drptype").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            },
            error: function (data) {
            }
        });
    }
}

function CourtYear() {
    $.ajax({
        type: "POST",
        url: "/firm/Addcaseyear?crtid=",
        dataType: "json",
        success: function (data) {
            $("#drpYear1").append("<option value='0'>Select Matter Year</option>");
            $("#drpYearAdd").append("<option value='0'>Select Matter Year</option>");
            $("#RevenueYear1").append("<option value='0'>Select Matter Year</option>");
            $("#reracaseyear1").append("<option value='0'>Select Matter Year</option>");
            for (var i = 0; i < data.length; i++) {
                var caseyearlength = data[i].caseyear;
            }
            startYear = new Date().getFullYear()
            for (var i = parseInt(startYear); i >= parseInt(caseyearlength); i--) {
                $("#drpYear1").append("<option value='" + i + "'>" + i + "</option>");
                $("#drpYearAdd").append("<option value='" + i + "'>" + i + "</option>");
                $("#RevenueYear1").append("<option value='" + i + "'>" + i + "</option>");
                $("#reracaseyear1").append("<option value='" + i + "'>" + i + "</option>");



            }
        },
        error: function (data) {
        }
    });
}


function ConsumerDistrictAndState() {
    var benchValue = document.getElementById('CFBench1').value;
    if (benchValue == "B") {
        document.getElementById("ConsumerDistrictState").style.display = "none";
    }
    else if (benchValue == "C") {
        document.getElementById("ConsumerDistrictState").style.display = "block";
        document.getElementById("CfState").style.display = "block";
        document.getElementById("CfDistrict").style.display = "none";
        fillNCDRCState1("CF", "c", 0);

    }
    else if (benchValue == "E") {
        document.getElementById("ConsumerDistrictState").style.display = "block";
        fillNCDRCState1("CF", "E", 1);

        document.getElementById("CfState").style.display = "block";
    }
    else {
        document.getElementById("ConsumerDistrictState").style.display = "none";
    }

}

function DecideStateAndDistrictType() {
    var benchValue = document.getElementById('CFBench1').value;

    if (benchValue == "C") {

        return
    }
    else if (benchValue == "E") {
        document.getElementById("CfDistrict").style.display = "block";
        var stateId = document.getElementById('drpncdrcstate1').value;
        fillNCDRCDistrict1(stateId);
    }
}

/*Fill NCDRC State*/
function fillNCDRCState1(crtid, benchid, idist) {
    //var idist = 0;
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

/*Fill NCDRC District*/
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


function addtaskmember4() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/MatterApi/TeamMemberbyFirmId",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                var datas = JSON.stringify(response);
                //alert(datas);
                var obj = JSON.parse(response.Data);
            }
            else {
                //alert("not found");
            }
            var html3 = '';
            $("#addtaskmember4,#teammemberss,#addtaskmemberManual").html("");

            var NewMemberID = "@ViewBag.TeamMember"
            const NewMemberID1 = NewMemberID.split(',');
            if (NewMemberID1 != null) {
                $("#addtaskmember4,#teammemberss,#addtaskmemberManual").html("");
                $.each(NewMemberID1, function (key1, value1) {
                    if (response != null) {
                        $(".ms-selectall").show();
                        $.each(obj, function (key, value) {
                            if (value.id == value1) {
                                $("#addtaskmember4,#teammemberss,#addtaskmemberManual").append($("<option></option>").val(value.id).text(value.UserName));
                            }
                            else {
                            }
                        });
                        $("#addtaskmember4,#teammemberss,#addtaskmemberManual").val(NewMemberID1);
                    }
                    else {

                    }
                });
            }
            //else {
            if (response != null) {
                $(".ms-selectall").show();
                $.each(obj, function (key, value) {
                    if (value.roleid != 1) {
                        $("#addtaskmember4,#teammemberss,#addtaskmemberManual").append($("<option></option>").val(value.id).text(value.UserName));
                    }
                });
            }
            else {
            }
            $("#addtaskmember4,#teammemberss,#addtaskmemberManual").multiselect('reload');
        },
        failure: function (response) {
        }, //End of AJAX failure function
        error: function (response) {
        } //End of AJAX error function
    });
}

function BindRevenueMandal1() {
    var RevCourt = document.getElementById("drpcourtname1").value;
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

/*Bind Revenue Court1*/
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
            $("#drpcourtname1").empty().html(option);
        },
        error: function (data) {
        }
    });
}


/*Rera court name*/
function fillReraCourt1() {
    var reracourt = "";
    $("#drpcourtname1 option").remove();
    $.ajax({
        type: "POST",
        url: "/AddCase/BindReraCourtType?reracourt=" + reracourt,
        dataType: "json",
        success: function (data) {
            $("#drpcourtname1").append("<option value='0'>-Select Court-</option>");
            for (var i = 0; i < data.length; i++) {
                $("#drpcourtname1").append("<option value='" + data[i].casetype + "'>" + data[i].casetypename + "</option>");
            }
        },
        error: function (data) {
        }
    });
}

///*Bind Revenue Janpad*/
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

///*Bind Revenue Janpad by Court*/
// Change by Subhash
function BindRevenueJanpadbyCourt() {
    var vCourtval = document.getElementById("drpcourtname1").value;
    $("#RevenueJanpadR option:not(:first)").remove();
    $("#RevenueTahsilR option:not(:first)").remove();
    $("#RevenueCourtNameR option:not(:first)").remove();

    $.ajax({
        type: "POST",
        url: "/Revenue/FillJanpadByRevenueCourt?vCourtval=" + vCourtval,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            // jQuery already parsed JSON, so no need for JSON.parse
            var obj = response.data;
            var option = "<option value=''>Select District</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["JanpadValue"] + '">' + a["JanpadName"] + '</option>';
            });

            $("#RevenueJanpadR").html(option);
        },
        error: function (err) {
            console.error("Error fetching Janpad data:", err);
        }
    });
}
function BindRevenueTahsilbyCourt() {
    var vCourtval = document.getElementById("drpcourtname1").value;
    $("#RevenueTahsilR option:not(:first)").remove();
    $("#RevenueCourtNameR option:not(:first)").remove();

    $.ajax({
        type: "POST",
        url: "/Revenue/FillTahsilByRevenueCourt?vCourtval=" + vCourtval,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            // jQuery already parsed JSON, so no need for JSON.parse
            var obj = response.data;
            var option = "<option value=''>Select Court Name</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["TahsilValue"] + '">' + a["TahsilName"] + '</option>';
            });

            $("#RevenueTahsilR").html(option);
        },
        error: function (err) {
            console.error("Error fetching Tahsil data:", err);
        }
    });
}
function BindRevenueCourtNameByTahsilAndJanpad() {
    $("#RevenueCourtNameR option:not(:first)").remove();
    var vCourtval = document.getElementById("drpcourtname1").value;
    var janpadVal = document.getElementById("RevenueJanpadR").value;
    var tahsilVal = document.getElementById("RevenueTahsilR").value;
    var option = "";
    if (vCourtval == "" || janpadVal == "" || tahsilVal == "") {
        return;
    }
    $.ajax({
        type: "POST",
        url: "/Revenue/FillRevenueCourtByTahsilAndJanpad?vCourtval=" + vCourtval + "&janpadVal=" + janpadVal + "&tahsilVal=" + tahsilVal,
        dataType: "json",
        success: function (data) {
            var response = JSON.parse(data);
            var obj = response.data;
            option += "<option value=''>Select Court Type</option>";
            $.each(obj, function (i, a) {
                option += '<option value="' + a["RevenueCourtValue"] + '" >  ' + a["RevenueCourtName"] + '</option>';
            });
            $("#RevenueCourtNameR").empty().html(option);
        },
        error: function (data) {
        }
    });
}

//End
function fillReraCaseType1() {
    var reracourt = document.getElementById("drpcourtname1").value;
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


function FetchCaseDetails() {

    $("#Modalmattername").val("");
    $("#Modalmattername").val(mname);
    addtaskmember4();
    // $('#mattermanualName')[0].reset();

    var formData = new FormData();
    var dairyNo = "";
    var caseNo = "";
    var caseyear = "";
    var caseTypes = "";
    var vBench = "";
    var vside = "";
    var stampReg = "";
    var drpcourtname = "";

    var vCourtType = document.getElementById('divSCHCDistrict1').value;
    if (vCourtType == "" || vCourtType == undefined || vCourtType == null) {
        alert("Please select the  Court Type.");
        return;
    }
    if (vCourtType == "1") //Suprem court fetch section
    {
        // formData.append("divSCHCDistrict", EncodeText(vCourtType));
        // formData.append("drpcourtname", EncodeText($("SC")))
        var caseType = document.getElementById("divSCDECD1").value;
        if (caseType == "" || caseType == undefined || caseType == null) {
            alert("Please select CaseType or Diary.");
            return;
        }
        if (caseType == "0") {
            if (document.getElementById("drptype").value != "0") {
                caseTypes = $("#drptype").val();
                //formData.append("drptype", EncodeText())
            }
            else {
                alert("please select the matter type.");
                return;
            }
            if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                alert("please enter the Matter Number");
                return;
            }
            else {
                caseNo = $("#txtno1").val();
            }
            if (document.getElementById("drpYear1").value != "0") {
                caseyear = $("#drpYear1").val();
            }
            else {
                alert("please select the Matter Year.");
                return;
            }

        }
        else if (caseType == "1") {
            if ($("#txtDiaryNo1").val() == "" || $("#txtDiaryNo1").val() == null || $("#txtDiaryNo1").val() == undefined) {
                alert("please enter the Dairy Number");
                return;
            }
            else {
                // formData.append("txtDiaryNo", EncodeText());
                dairyNo = $("#txtDiaryNo1").val();
            }

            if (document.getElementById("drpYear1").value != "0") {
                //formData.append("drpYear: ", EncodeText($("#drpYear1").val()));
                caseyear = $("#drpYear1").val();

            }
            else {
                alert("please select the Matter Year.");
                return;
            }

        }
        formData = createFormDataValue("SC", caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
            dairyNo, vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
    }
    else if (vCourtType == "2") {
        drpcourtname = $("#drpcourtname1").val();
        caseNo = ""

        caseyear = "";
        caseTypes = "";
        vBench = "";
        vside = "";
        stampReg = "";
        if (drpcourtname == "" || drpcourtname == null || drpcourtname == undefined || drpcourtname == "0") {
            alert("Please select the Court Name");
            return
        }
        if (drpcourtname == "UP" || drpcourtname == "WB" || drpcourtname == "GH" || drpcourtname == "JK" || drpcourtname == "KA" || drpcourtname == "MP" || drpcourtname == "TN" || drpcourtname == "BH" || drpcourtname == "RH") {
            vBench = $("#divBench").val();
            if (vBench == "" || vBench == undefined || vBench == null) {
                alert("Please select the Bench");
                return;
            }
            caseTypes = $("#drptypeBench").val();
            if (caseTypes == "" || caseTypes == undefined || caseTypes == null || caseTypes == "0") {
                alert("Please select the Matter Type");
                return;
            }
            if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                alert("please enter the Matter Number");
                return;
            }
            else {
                caseNo = $("#txtno1").val();
            }

            if (document.getElementById("drpYear1").value != "0") {
                caseyear = $("#drpYear1").val();
            }
            else {
                alert("please select the Matter Year.");
                return;
            }

            switch (drpcourtname) {
                case "UP":
                    formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", vBench, "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
                    break;
                case "WB":
                    formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", vBench, "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
                    break;
                case "GH":
                    formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", vBench, "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
                    break;
                case "JK":
                    formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", vBench, "", "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
                    break;
                case "KA":
                    formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", vBench, "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
                    break;
                case "MP":
                    formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", vBench, "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
                    break;
                case "TN":
                    formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
                    break;
                case "BH":
                    formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", vBench, "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
                    break;
                case "RH":
                    formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
                    break;
            }



        }
        else if (drpcourtname == "MH") {
            sideIds = "";
            stampRegs = "";
            vBenchMH = "";
            vBench = $("#divBench").val();
            if (vBench == "" || vBench == undefined || vBench == null) {
                alert("Please select the Bench");
                return;
            }
            else if (vBench == "Goa") {

                vBench = $("#divBench").val();
                caseTypes = $("#drptypeBench").val();
                if (caseTypes == "" || caseTypes == undefined || caseTypes == null || caseTypes == "0") {
                    alert("Please select the Matter Type");
                    return;
                }
                if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                    alert("please enter the Matter Number");
                    return;
                }
                else {
                    caseNo = $("#txtno1").val();
                }

                if (document.getElementById("drpYear1").value != "0") {
                    caseyear = $("#drpYear1").val();
                }
                else {
                    alert("please select the Matter Year.");
                    return;
                }
                formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", vBench, "", "", "", "", "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
            }
            else {
                if ($("#divBench1").val() == "" || $("#divBench1").val() == undefined || $("#divBench1").val() == null) {
                    alert("Please select the Bench");
                    return;
                }
                else {
                    vBench = $("#divBench1").val();

                    var vside = $("#drpside1").val();
                    if (vside == "" || vside == undefined || vside == null || vside == "0") {
                        alert("Please select the Side ");
                        return;
                    }
                    var stampReg = $("#drpstampregister1").val();
                    if (stampReg == "" || stampReg == undefined || stampReg == null) {
                        alert("Please select the Stamp/Register ");
                        return;
                    }

                    caseTypes = $("#drptypeMH").val();
                    if (caseTypes == "" || caseTypes == undefined || caseTypes == null || caseTypes == "0") {
                        alert("Please select the Matter Type");
                        return;
                    }
                    if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                        alert("please enter the Matter Number");
                        return;
                    }
                    else {
                        caseNo = $("#txtno1").val();
                    }

                    if (document.getElementById("drpYear1").value != "0") {
                        caseyear = $("#drpYear1").val();
                    }
                    else {
                        alert("please select the Matter Year.");
                        return;
                    }
                }
                sideIds = vside;
                stampRegs = stampReg;
                vBenchMH = vBench;
                formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", vBench, vside, stampReg, "", "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "")
            }
        }

        else {
            caseTypes = $("#drptype").val();
            if (caseTypes == "0" || caseTypes == "" || caseTypes == undefined || caseTypes == null || caseTypes == "0") {
                alert("Please select the Matter Type");
                return;
            }
            if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                alert("please enter the Matter Number");
                return;
            }
            else {
                caseNo = $("#txtno1").val();
            }

            if (document.getElementById("drpYear1").value != "0") {
                caseyear = $("#drpYear1").val();
            }
            else {
                alert("please select the Matter Year.");
                return;
            }
            formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
        }
    }

    else if (vCourtType == "3") {
        if (iscnrrequest != "1") {
            drpcourtname = $("#drpcourtnameDC1").val();
            var vDistrict = "";
            caseNo = "";
            caseyear = "";
            caseTypes = "";
            var DistrictCourt = "";
            var CourtEstablishment = "";
            if (drpcourtname == "0" || drpcourtname == "" || drpcourtname == undefined || drpcourtname == null) {
                alert("Please select the  State/UT.")
                return;
            }
            vDistrict = $("#drpdistrictcourtname1").val();

            if (vDistrict == "0" || vDistrict == "" || vDistrict == undefined || vDistrict == null) {
                alert("Please select the  District .")
                return;
            }
            CourtEstablishment = $("#drpcourtcomplexestb1").val();


            if (CourtEstablishment == "0" || CourtEstablishment == "" || CourtEstablishment == undefined || CourtEstablishment == null) {
                alert("Please select the  Court Establishment.")
                return;
            }
            DistrictCourt = $("#drpcompestbcourt1").val();
            if (DistrictCourt == "0" || DistrictCourt == "" || DistrictCourt == undefined || DistrictCourt == null) {
                alert("Please select the  District Court.")
                return;
            }
            caseTypes = $("#drptype").val();
            if (caseTypes == "" || caseTypes == undefined || caseTypes == null || caseTypes == "0") {
                alert("Please select the  Matter Type.")
                return;
            }
            caseNo = $("#txtno1").val();
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the  Matter Number.")
                return;
            }
            caseyear = $("#drpYear1").val();
            if (caseyear == "" || caseyear == "0" || caseyear == undefined || caseyear == null) {
                alert("Please  Select the Matter Year .")
                return;
            }
            formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, vDistrict, CourtEstablishment, DistrictCourt, "", "", "", drpcourtname, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
        }
        else {
            drpcourtname = $("#drpcourtnameDC1Cnr").val();
            var cnr = $("#drpdcourtcnr1").val();
            if (drpcourtname == null || drpcourtname == undefined || drpcourtname == "" || drpcourtname == "0") {
                alert("State/UT should not be empty.");
                document.getElementById('drpcourtnameDC1Cnr').focus();
                document.getElementById('drpcourtnameDC1Cnr').style.border = "1px solid red";
                $('#casewatchmodel').modal('show');
                return false;
            }
            if (cnr == "" || cnr == null || cnr == undefined) {
                alert("District CNR No. should not be empty.");
                document.getElementById('drpdcourtcnr1').focus();
                document.getElementById('drpdcourtcnr1').style.border = "1px solid red";
                $('#casewatchmodel').modal('show');
                return false;
            }

            if (cnr != "") {
                var isValid = false;
                var regex = /^[a-zA-Z0-9]*$/;
                isValid = regex.test(cnr);
                if (isValid == false) {
                    alert("District CNR No. should be Alphanumeric Only.");
                    document.getElementById('drpdcourtcnr1').focus();
                    document.getElementById('drpdcourtcnr1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
                if (cnr.length < 16 || cnr.length < 16) {
                    alert("District CNR No. should be equal to 16 digits.");
                    document.getElementById('drpdcourtcnr1').focus();
                    document.getElementById('drpdcourtcnr1').style.border = "1px solid red";
                    $('#casewatchmodel').modal('show');
                    return false;
                }
            }
            formData = createFormDataValue("0", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", drpcourtname, "", "", "", "", "", "", "", "", "", "", "", "", "", "", cnr, "", "", "", "", "", "", "", "", "", "", "", "", "", "");
        }

    }
    else if (vCourtType == "4") {
        drpcourtname = $("#drpcourtname1").val();
        if (drpcourtname == "0" || drpcourtname == "" || drpcourtname == undefined || drpcourtname == null) {
            alert("Please select the  Court Name.")
            return;
        }

        if (drpcourtname == "CF") {
            caseNo = $("#txtno2").val();
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the Appeal Number.");
                return;
            }
            vBench = $("#CFBench1").val();
            if (vBench == "" || vBench == undefined || vBench == null) {
                alert("Please select the Bench");
                return;
            }
            if (vBench == "B") {
                formData = createFormDataValue(drpcourtname, caseNo, "0", "0", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
            }
            else if (vBench == "C") {
                var state = $("#drpncdrcstate1").val();
                if (state == "0" || state == "" || state == undefined || state == null) {
                    alert("Please select the State");
                    return;
                }
                formData = createFormDataValue(drpcourtname, caseNo, "0", "0", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", state, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
            }
            else if (vBench == "E") {
                var state = $("#drpncdrcstate1").val();
                if (state == "0" || state == "" || state == undefined || state == null) {
                    alert("Please select the State");
                    return;
                }
                var district = $("#drpncdrcDistrict1").val();
                if (district == "0" || district == "" || district == undefined || district == null) {
                    alert("Please select the District");
                    return;

                }
                formData = createFormDataValue(drpcourtname, caseNo, "0", "0", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", state, district, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
            }
            else;
        }
        else if (drpcourtname == "DT") {
            var matterType = $("#divSCDECD1").val();
            if (matterType == "" || matterType == undefined || matterType == null) {
                alert("Please select the CaseType / Diary");
                return;
            }
            caseyear = "";
            caseTypes = "";
            vBench = "";
            caseNo = "";
            if (matterType == "0") {
                vBench = $("#divBench").val();
                caseTypes = $("#drptypeBench").val();
                caseNo = $("#txtno1").val();
                caseyear = $("#drpYear1").val();
                if (vBench == "" || vBench == undefined || vBench == null) {
                    alert("Please select the Bench");
                    return;
                }
                if (caseTypes == "0" || caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                    alert("Please select the Matter Type.");
                    return;
                }
                if (caseNo == "" || caseNo == undefined || caseNo == null) {
                    alert("Please enter the Matter Number.");
                    return;
                }
                if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                    alert("Please select the Matter Year.");
                    return;
                }
                formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
            }
            else if (matterType == "1") {
                vBench = $("#divBenchDt").val();
                caseNo = $("#txtDiaryNo1").val();
                caseyear = $("#drpYear1").val();
                caseTypes = $("#divSCDECD1").val();
                if (vBench == "" || vBench == undefined || vBench == null) {
                    alert("Please select the Bench");
                    return;
                }
                if (caseNo == "" || caseNo == undefined || caseNo == null) {
                    alert("Please enter the Dairy Number.");
                    return;
                }
                if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                    alert("Please select the Matter Year.");
                    return;
                }
                formData = createFormDataValue(drpcourtname, "", caseTypes, caseyear, "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    caseNo, vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
            }
            else;
        }
        else if (drpcourtname == "OERC") {
            caseNo = $("#txtno1").val();
            caseyear = $("#drpYear1").val();
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the Matter Number.");
                return;
            }
            if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                alert("Please select the Matter Year.");
                return;
            }
            formData = createFormDataValue(drpcourtname, caseNo, "0", caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
        }
        else if (drpcourtname == "CI" || drpcourtname == "IT" || drpcourtname == "CT" || drpcourtname == "CE" || drpcourtname == "NL" || drpcourtname == "NC" || drpcourtname == "NGT" || drpcourtname == "RC" || drpcourtname == "GS") {
            vBench = $("#divBench").val();
            caseTypes = $("#drptypeBench").val();
            caseNo = $("#txtno1").val();
            caseyear = $("#drpYear1").val();
            if (vBench == "" || vBench == undefined || vBench == null) {
                alert("Please select the Bench");
                return;
            }
            if (caseTypes == "0" || caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                alert("Please select the Matter Type.");
                return;
            }
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the Matter Number.");
                return;
            }
            if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                alert("Please select the Matter Year.");
                return;
            }
            formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
        }
        else {
            caseTypes = $("#drptype").val();
            caseNo = $("#txtno1").val();
            caseyear = $("#drpYear1").val();
            if (caseTypes == "0" || caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                alert("Please select the Matter Type.");
                return;
            }
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the Matter Number.");
                return;
            }
            if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                alert("Please select the Matter Year.");
                return;
            }
            formData = createFormDataValue(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
        }


    }

    else if (vCourtType == "6") {
        drpcourtname = $("#divSCHCDistrict1").val();
        drpcourtname = "drpcourtname1";
        var mattersRevnue = $("#mattersRevnueR").val();
        var RevenueAppelNo = $("#RevenuetxtnoR").val();
        var RevenueJanpad = $("#RevenueJanpadR").val();
        var RevenueTahsil = $("#RevenueTahsilR").val();
        var RevenueCourt = "RERH"
        var RevenueCourtName = $("#RevenueCourtNameR").val();
        if (RevenueJanpad == "0" || RevenueJanpad == "" || RevenueJanpad == undefined || RevenueJanpad == null) {
            alert("Please select the Janpad.");
            return;
        }
        if (RevenueTahsil == "0" || RevenueTahsil == "" || RevenueTahsil == undefined || RevenueTahsil == null) {
            alert("Please select the  Tahsil.")
            return;
        }
        if (RevenueCourtName == "0" || RevenueCourtName == "" || RevenueCourtName == undefined || RevenueCourtName == null) {
            alert("Please select the  RevenueCourt .")
            return;
        }

        if (RevenueAppelNo == "0" || RevenueAppelNo == "" || RevenueAppelNo == undefined || RevenueAppelNo == null) {
            alert("Please select the  Appeal No.")
            return;
        }
        if (mattersRevnue == "0" || mattersRevnue == "" || mattersRevnue == undefined || mattersRevnue == null) {
            //alert("Please select the  Matter.")
            //return;
        }
        formData = createFormDataValue(drpcourtname, RevenueAppelNo, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
            "", vCourtType, vDistrict, "", DistrictCourt, "", "", "", drpcourtname, RevenueCourt, "", RevenueJanpad, RevenueTahsil, RevenueCourtName, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
    }
    openloadCW();
    $.ajax(
        {
            type: "POST",
            url: "/CW/SearchCaseLiveUpdateToCW", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                $("#tblsserch").text('');
                if (data.length > 0) {
                    if (RevenueCourt == "RERH") {
                        $('#addMatterModalDetailsRERH').modal({ show: true });
                        $('#mongoresetRERH')[0].reset();
                        $.each(data, function (i, val) {
                            // set value  for binding
                            $("#vCourt").val("Revenue(Rajasthan)");
                            $("#appealNo").val(val.AppealNo);
                            $("#courtName").val($("#RevenueCourtNameR option:selected").text().trim());
                            $("#Appres").val(val.Appres);
                            $("#Counsels").val(val.Counsels);
                            cType = val.CourtName;
                            $("#CasuelistDate").val(val.vCasuelistDate);
                            $("#District").val(val.janpadval);
                            $("#CourtType").val(val.tahsilval);
                            $("#Status").val(val.purpose);
                            $("#Matters").val(val.Appres);
                            $('#Matters').attr('title', val.Appres);
                        });
                    }
                    else {
                        $('#addMatterModalDetails').modal({ show: true });
                        $('#mongoreset')[0].reset();
                        $.each(data, function (i, val) {
                            // set value on hidden fields  start
                            $("#Cnrno").val(val.CNRNo);
                            $("#Casetype").val(val.CaseType);
                            $("#Caseno").val(val.Caseno);
                            $("#Caseyear").val(val.CaseYear);
                            $("#DiaryNo").val(val.AppealNo);
                            $("#Court").val(val.Court);
                            $("#courtnamess").val(val.CourtName);
                            if (val.Court == "SC") {
                                $("#courtnamess").val("Supreme Court")
                            } else if (val.Court == "SC") {
                                $("#courtnamess").val("High Court")
                            }
                            else if (val.Court == "DC") {
                                $("#courtnamess").val("District Court")
                            }
                            else if (val.Court == "TC") {
                                $("#courtnamess").val("Tribunals")
                            }
                            $("#BenchID").val(val.Benchid);
                            $("#BenchName").val(val.BenchName);
                            $("#StateId").val(val.vState);
                            $("#Districtid").val(val.District);
                            $("#Courttype").val(val.courttype);
                            $("#casename").val(val.Appres);
                            $('#casename').attr('title', val.Appres);
                            $("#mhearingdate").val(formatDatetoIST(val.nexthearingdate));
                            $("#madvocatename").val(val.Counsels);
                            $('#madvocatename').attr('title', val.Counsels);
                            $("#Courtcompestbtype").val(val.CompEstbType);
                            $("#Courtcompestbcourt").val(val.CompEastbCourtId);
                            $("#MatterNamess").val(mname && mname.trim() !== "" ? mname : val.Appres);
                            $('#MatterNamess').attr('title', mname && mname.trim() !== "" ? mname : val.Appres);
                            sideId = val.vDocumentType;
                            stampReg = val.vStampReg;
                        });
                    }
                    closeloadCW();
                }
                else {
                    $('#addMatterModal').modal({ show: true });
                    closeloadCW();
                }
            },
            failure: function (data) {
                $('#addMatterModal').modal({ show: true });
                closeloadCW();
            },
            error: function (data) {
                $('#addMatterModal').modal({ show: true });
                closeloadCW();
            }
        })

}



function createFormDataValue(
    drpcourtname, txtno, drptype, drpYear, txtFileNo,
    drpKAbench, drpGoa, drpbench, drpside, drpstampregister,
    drpNCBench, divTNBench, divRHBench, divJKBench, divBHBench,
    divMPBench, divUPBench, divGHBench, divWBBench, casedetails,
    txtDiaryNo, divSCHCDistrict, drpdistrictcourtname, drpcourtcomplexestb,
    drpcompestbcourt, drpncdrcstate, drpncdrcDistrict, txtsuffix,
    drpcourtnameDC, RevenueCourt, RevenueMandal, RevenueJanpad,
    RevenueTahsil, RevenueCourtName, Revenuetxtno, RevenueYear,
    RevenueRefNo, ReraCourt, reracasetype, reracasno, reracaseyear,
    reraRefNo, drpdistrictcourtfullname, drpdcourtcnr1, caseinfo,
    matterid, txtcasename, dtnhearingdate, txtcustomadvocate, txtcustomstatus,
    mattersforlink21, assignuser, checkclient, usertypes, confirmPassword,
    casecasetype, odate, clientname, newcompanyid
) {
    let formData = new FormData();

    formData.append("drpcourtname", EncodeText(drpcourtname));
    formData.append("txtno", EncodeText(txtno));
    formData.append("drptype", EncodeText(drptype));
    formData.append("drpYear", EncodeText(drpYear));
    formData.append("txtFileNo", EncodeText(txtFileNo));
    formData.append("drpKAbench", EncodeText(drpKAbench));
    formData.append("drpGoa", EncodeText(drpGoa));
    formData.append("drpbench", EncodeText(drpbench));
    formData.append("drpside", EncodeText(drpside));
    formData.append("drpstampregister", EncodeText(drpstampregister));
    formData.append("drpNCBench", EncodeText(drpNCBench));
    formData.append("divTNBench", EncodeText(divTNBench));
    formData.append("divRHBench", EncodeText(divRHBench));
    formData.append("divJKBench", EncodeText(divJKBench));
    formData.append("divBHBench", EncodeText(divBHBench));
    formData.append("divMPBench", EncodeText(divMPBench));
    formData.append("divUPBench", EncodeText(divUPBench));
    formData.append("divGHBench", EncodeText(divGHBench));
    formData.append("divWBBench", EncodeText(divWBBench));
    formData.append("casedetails", EncodeText(casedetails));
    formData.append("txtDiaryNo", EncodeText(txtDiaryNo));
    formData.append("divSCHCDistrict", EncodeText(divSCHCDistrict));
    formData.append("drpdistrictcourtname", EncodeText(drpdistrictcourtname));
    formData.append("drpcourtcomplexestb", EncodeText(drpcourtcomplexestb));
    formData.append("drpcompestbcourt", EncodeText(drpcompestbcourt));
    formData.append("drpncdrcstate", EncodeText(drpncdrcstate));
    formData.append("drpncdrcDistrict", EncodeText(drpncdrcDistrict));
    formData.append("txtsuffix", EncodeText(txtsuffix));
    formData.append("drpcourtnameDC", EncodeText(drpcourtnameDC));
    formData.append("RevenueCourt", EncodeText(RevenueCourt));
    formData.append("RevenueMandal", EncodeText(RevenueMandal));
    formData.append("RevenueJanpad", EncodeText(RevenueJanpad));
    formData.append("RevenueTahsil", EncodeText(RevenueTahsil));
    formData.append("RevenueCourtName", EncodeText(RevenueCourtName));
    formData.append("Revenuetxtno", EncodeText(Revenuetxtno));
    formData.append("RevenueYear", EncodeText(RevenueYear));
    formData.append("RevenueRefNo", EncodeText(RevenueRefNo));
    formData.append("ReraCourt", EncodeText(ReraCourt));
    formData.append("reracasetype", EncodeText(reracasetype));
    formData.append("reracasno", EncodeText(reracasno));
    formData.append("reracaseyear", EncodeText(reracaseyear));
    formData.append("reraRefNo", EncodeText(reraRefNo));
    formData.append("drpdistrictcourtfullname", EncodeText(drpdistrictcourtfullname));
    formData.append("drpdcourtcnr1", EncodeText(drpdcourtcnr1));
    formData.append("caseinfo", EncodeText(caseinfo));
    formData.append("matterid", EncodeText(matterid));
    formData.append("txtcasename", EncodeText(txtcasename));
    formData.append("dtnhearingdate", EncodeText(dtnhearingdate));
    formData.append("txtcustomadvocate", EncodeText(txtcustomadvocate));
    formData.append("txtcustomstatus", EncodeText(txtcustomstatus));
    formData.append("mattersforlink21", EncodeText(mattersforlink21));
    formData.append("assignuser", EncodeText(assignuser));
    formData.append("checkclient", EncodeText(checkclient));
    formData.append("usertypes", EncodeText(usertypes));
    formData.append("confirmPassword", EncodeText(confirmPassword));
    formData.append("casecasetype", EncodeText(casecasetype));
    formData.append("odate", EncodeText(odate));
    formData.append("clientname", EncodeText(clientname));
    formData.append("newcompanyid", EncodeText(newcompanyid));

    return formData;
}


///*Add  Live update from search case*/
$(document).on("click", "#AddcaseSearchCase", function () {
    var Cnrnos = $("#Cnrno").val();

    var Casetypes = $("#Casetype").val();
    var Casenos = $("#Caseno").val();
    var Caseyears = $("#Caseyear").val();
    var AppealNo = $("#DiaryNo").val();
    var Courts = $("#Court").val();
    if (Courts == "HRRA") {
        Casetypes = $("#reracasetype1").val();
    }
    if (Courts == "RERH") {

    }
    var BenchIDs = $("#BenchID").val();
    var StateIds = $("#StateId").val();
    var Districtids = $("#Districtid").val();
    var Courttypes = $("#divSCHCDistrict1").val();
    var casenames = $("#casename").val();
    var mhearingdates = $("#mhearingdate").val();
    var madvocatenames = $("#madvocatename").val();
    var Courtcompestbtypes = $("#Courtcompestbtype").val();
    var Courtcompestbcourts = $("#Courtcompestbcourt").val();
    var mkcasenames = $("#MatterNamess").val();
    if (mkcasenames == "") {
        alert("Please enter the matter name.");
        return false;
    }
    if (mkcasenames != "") {
        var litigationcasenameer = mkcasenames.substr(0, 100);
        var casensss = litigationcasenameer;

    }
    var teammemberlist = $("#teammemberss").val();
    var casedetails1 = "";
    //Added Today
    var othercourttxt = $("#drpcourtname1 option:selected").text();
    if (Courttypes == "2" || Courttypes == "4") {
        if (othercourttxt == "-Select Court Name-") {
            othercourttxt = "";
        }
    }
    else if (Courttypes == "1") {
        othercourttxt = "Supreme Court"
    }
    else {
        othercourttxt = "";
    }
    var formData = new FormData();
    formData.append("Cnrnos", EncodeText(Cnrnos));
    formData.append("Casetypes", EncodeText(Casetypes));
    formData.append("Casenos", EncodeText(Casenos));
    formData.append("AppealNo", EncodeText(AppealNo));
    formData.append("Caseyears", EncodeText(Caseyears));
    formData.append("Courts", EncodeText(Courts));
    formData.append("BenchIDs", EncodeText(BenchIDs));
    formData.append("StateIds", EncodeText(StateIds));
    formData.append("Districtids", EncodeText(Districtids));
    formData.append("Courttypes", EncodeText(Courttypes));
    formData.append("casenames", EncodeText(casenames));
    formData.append("mhearingdates", EncodeText(mhearingdates));
    formData.append("madvocatenames", EncodeText(madvocatenames));
    formData.append("Courtcompestbtypes", EncodeText(Courtcompestbtypes));
    formData.append("Courtcompestbcourts", EncodeText(Courtcompestbcourts));
    formData.append("mkcasenames", EncodeText(casensss));
    formData.append("teammemberlist", EncodeText(teammemberlist));
    formData.append("suffix", EncodeText(""));
    formData.append("sideId", EncodeText($("#drpside1").val()));
    formData.append("stampReg", EncodeText($("#drpstampregister1").val()));
    formData.append("othercourttxt", EncodeText(othercourttxt));
    formData.append("mkId", EncodeText(mid));
    if (Courttypes == "6") {
        othercourttxt = "Rajasthan";
        formData.append("vCourt", EncodeText($("#vCourt").val()));
        formData.append("Appres", EncodeText($("#Appres").val()));
        formData.append("appealNo", EncodeText($("#appealNo").val()));
        formData.append("District", EncodeText($("#District").val()));
        formData.append("CourtType", EncodeText($("#CourtType").val()));
        formData.append("courtName", EncodeText($("#courtName").val()));
        formData.append("Status", EncodeText($("#Status").val()));
    }
    openloadCW();
    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/SearchCaseAddLiveUpdate", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "Sorry! Unable to Add now.") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Sorry! Unable to Add Case.',
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
                else if (data.Data == "Exist") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Matter Detail Already Exists!!',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW();
                }
                else if (data.Data == "Case entry Limit Exceeded, Please upgrade your plan.") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Case entry Limit Exceeded, Please upgrade your plan.',
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
                    else if (data.Data == "success") {
                        new PNotify({
                            title: 'Success!',
                            text: ' case saved successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#addMatterModalDetails").modal("hide")
                        closeloadCW();
                        RestValue();
                        sessionStorage.setItem("directAddCW", "1");
                        //hsmklitigation();
                        var fcode5 = localStorage.getItem("FirmCode");
                        if (hsmklitigation == "display:unset" && dashmatter == "display:unset") {
                            //window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                            location.reload();
                        }
                        else if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                            location.reload();
                        }
                        else {
                            //window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                            location.reload();
                        }
                    }
                    else {
                        alert(data.Data);
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
});
$(document).on("click", "#AddcaseSearchCaseRERH", function () {
    var Status = $("#Status").val();
    var Appres = $("#Appres").val();
    var CourtName = $("#courtName").val();
    var CourtType = $("#CourtType").val();
    var District = $("#District").val();
    var AppealNo = $("#appealNo").val();
    var vCourt = $("#vCourt").val();
    var mkcasenames = $("#Matters").val();
    if (mkcasenames == "") {
        alert("Please enter the matter name.");
        return false;
    }
    if (mkcasenames != "") {
        var litigationcasenameer = mkcasenames.substr(0, 100);
        var casensss = litigationcasenameer;

    }
    var teammemberlist = $("#teammemberss").val();
    var casedetails1 = "";
    othercourttxt = "Rajasthan"
    var formData = new FormData();
    formData.append("Status", EncodeText(Status));
    formData.append("Appres", EncodeText(Appres));
    formData.append("courtName", EncodeText(CourtName));
    formData.append("CourtType", EncodeText(CourtType));
    formData.append("District", EncodeText(District));
    formData.append("appealNo", EncodeText(AppealNo));
    formData.append("Courts", EncodeText(vCourt));
    formData.append("othercourttxt", EncodeText(othercourttxt));
    formData.append("teammemberlist", EncodeText(teammemberlist));
    formData.append("mkId", EncodeText(mid));
    formData.append("mkcasenames", EncodeText(casensss));
    formData.append("cType", EncodeText(cType));
    openloadCW();
    $.ajax(
        {
            type: "POST",
            url: "/api/MatterApi/SearchCaseAddLiveUpdateRERH", // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "Sorry! Unable to Add now.") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Sorry! Unable to Add Case.',
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
				else if (data.Data == "Email Id not present") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Email in the profile section cannot be empty while adding a case. Please enter the email first before proceeding!',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW();
                }
                else if (data.Data == "Mobile No not present") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Mobile Number in the profile section cannot be empty while adding a case. Please enter the mobile number first before proceeding!',
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
                else if (data.Data == "Exist") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Matter Detail Already Exists!!',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW();
                }
                else if (data.Data == "Case entry Limit Exceeded, Please upgrade your plan.") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Case entry Limit Exceeded, Please upgrade your plan.',
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
                    else if (data.Data == "success") {
                        new PNotify({
                            title: 'Success!',
                            text: ' case saved successfully',
                            type: 'success',
                            delay: 3000
                        });
                        $("#addMatterModalDetails").modal("hide")
                        closeloadCW();
                        RestValue();
                        sessionStorage.setItem("directAddCW", "1");
                        //hsmklitigation();
                        var fcode5 = localStorage.getItem("FirmCode");
                        if (hsmklitigation == "display:unset" && dashmatter == "display:unset") {
                            //window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                            location.reload();
                        }
                        else if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                            location.reload();
                        }
                        else {
                            //window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                            location.reload();
                        }
                    }
                    else {
                        alert(data.Data);
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
});
function AddManualCaseWithoutSearch() {
    var formData = new FormData();
    var dairyNo = "";
    var caseNo = "";
    var caseyear = "";
    var caseTypes = "";
    var vBench = "";
    var vside = "";
    var stampReg = "";
    var drpcourtname = "";

    var caseTypeName = "";
    var vCourtType = document.getElementById('divSCHCDistrict1').value;

    var othercourttxt = $("#drpcourtname1 option:selected").text();
    if (vCourtType == "2" || vCourtType == "4" || vCourtType == "5") {
        if (othercourttxt == "-Select Court Name-") {
            othercourttxt = "";
        }
    }
    else if (vCourtType == "1") {
        othercourttxt = "Supreme Court"
    }
    else {
        othercourttxt = "";
    }
    if (vCourtType == "" || vCourtType == undefined || vCourtType == null) {
        alert("Please select the  Court Type.");
        return;
    }
    if (vCourtType == "1") //Suprem court section
    {
        // formData.append("divSCHCDistrict", EncodeText(vCourtType));
        // formData.append("drpcourtname", EncodeText($("SC")))
        var matterTypeName = ""
        var caseType = document.getElementById("divSCDECD1").value;
        if (caseType == "" || caseType == undefined || caseType == null) {
            alert("Please select CaseType or Diary.");
            return;
        }
        if (caseType == "0") {
            if (document.getElementById("drptype").value != "0") {
                caseTypes = $("#drptype").val();
                matterTypeName = $("#drptype option:selected").text();
                //formData.append("drptype", EncodeText())
            }
            else {
                alert("please select the casetype");
                return;
            }
            if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                alert("please enter the Matter Number");
                return;
            }
            else {
                caseNo = $("#txtno1").val();
            }
            if (document.getElementById("drpYear1").value != "0") {
                caseyear = $("#drpYear1").val();
            }
            else {
                alert("please select the Matter Year.");
                return;
            }

        }
        else if (caseType == "1") {
            matterTypeName = "Dairy No.";
            if ($("#txtDiaryNo1").val() == "" || $("#txtDiaryNo1").val() == null || $("#txtDiaryNo1").val() == undefined) {
                alert("please enter the Dairy Number");
                return;
            }
            else {
                // formData.append("txtDiaryNo", EncodeText());
                dairyNo = $("#txtDiaryNo1").val();
            }

            if (document.getElementById("drpYear1").value != "0") {
                //formData.append("drpYear: ", EncodeText($("#drpYear1").val()));
                caseyear = $("#drpYear1").val();

            }
            else {
                alert("please select the Matter Year.");
                return;
            }

        }
        var mattername = $("#Modalmattername").val();
        if (mattername == "" || mattername == null || mattername == undefined) {
            alert("Please enter the matter name.");
            return;
        }
        //After suprem court on 6th place keep matterid
        formData = AddManualCaseFormData("SC", caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
            dairyNo, vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, "SUPREME COURT",
            "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "", "", "", "");
    }
    else if (vCourtType == "2")// high court section
    {
        drpcourtname = $("#drpcourtname1").val();
        caseNo = ""

        caseyear = "";
        caseTypes = "";
        vBench = "";
        vside = "";
        stampReg = "";
        if (drpcourtname == "" || drpcourtname == null || drpcourtname == undefined) {
            alert("Please select the Court Name");
            return
        }
        if (drpcourtname == "UP" || drpcourtname == "WB" || drpcourtname == "GH" || drpcourtname == "JK" || drpcourtname == "KA" || drpcourtname == "MP" || drpcourtname == "TN" || drpcourtname == "BH" || drpcourtname == "RH") {
            vBench = $("#divBench").val();
            if (vBench == "" || vBench == undefined || vBench == null) {
                alert("Please select the Bench");
                return;
            }
            caseTypes = $("#drptypeBench").val();
            var matterTypeName = ""
            matterTypeName = $("#drptypeBench option:selected").text();
            if (caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                alert("Please select the Matter Type");
                return;
            }
            if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                alert("please enter the Matter Number");
                return;
            }
            else {
                caseNo = $("#txtno1").val();
            }

            if (document.getElementById("drpYear1").value != "0") {
                caseyear = $("#drpYear1").val();
            }
            else {
                alert("please select the Matter Year.");
                return;
            }

            var mattername = $("#Modalmattername").val();
            if (mattername == "" || mattername == null || mattername == undefined) {
                alert("Please enter the matter name.");
                return;
            }
            switch (drpcourtname) {
                case "UP":
                    formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", vBench, "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                        "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
                    break;
                case "WB":
                    formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", vBench, "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                        "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
                    break;
                case "GH":
                    formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", vBench, "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                        "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
                    break;
                case "JK":
                    formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", vBench, "", "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                        "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
                    break;
                case "KA":
                    formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", vBench, "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                        "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
                    break;
                case "MP":
                    formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", vBench, "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                        "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
                    break;
                case "TN":
                    formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                        "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
                    break;
                case "BH":
                    formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", vBench, "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                        "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
                    break;
                case "RH":
                    formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "",
                        "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                        "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
                    break;
            }



        }
        else if (drpcourtname == "MH") {

            sideIds = "";
            stampRegs = "";
            vBenchMH = "";
            vBench = $("#divBench").val();
            if (vBench == "" || vBench == undefined || vBench == null) {
                alert("Please select the Bench");
                return;
            }
            else if (vBench == "Goa") {

                vBench = $("#divBench").val();
                caseTypes = $("#drptypeBench").val();
                if (caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                    alert("Please select the Matter Type");
                    return;
                }
                matterTypeName = $("#drptypeBench option:selected").text();
                if (caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                    alert("Please select the Matter Type");
                    return;
                }
                if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                    alert("please enter the Matter Number");
                    return;
                }
                else {
                    caseNo = $("#txtno1").val();
                }

                if (document.getElementById("drpYear1").value != "0") {
                    caseyear = $("#drpYear1").val();
                }
                else {
                    alert("please select the Matter Year.");
                    return;
                }

                var mattername = $("#Modalmattername").val();
                if (mattername == "" || mattername == null || mattername == undefined) {
                    alert("Please enter the matter name.");
                    return;
                }
                formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", vBench, "", "", "", "", "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                    "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
            }
            else {
                if ($("#divBench1").val() == "" || $("#divBench1").val() == undefined || $("#divBench1").val() == null) {
                    alert("Please select the Bench");
                    return;
                }
                else {
                    vBench = $("#divBench1").val();

                    vside = $("#drpside1").val();
                    if (vside == "" || vside == undefined || vside == null || vside == "0") {
                        alert("Please select the Side ");
                        return;
                    }
                    stampReg = $("#drpstampregister1").val();
                    if (stampReg == "" || stampReg == undefined || stampReg == null) {
                        alert("Please select the Stamp/Register ");
                        return;
                    }

                    caseTypes = $("#drptypeMH").val();
                    if (caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                        alert("Please select the Matter Type");
                        return;
                    }

                    if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                        alert("please enter the Matter Number");
                        return;
                    }
                    else {
                        caseNo = $("#txtno1").val();
                    }

                    if (document.getElementById("drpYear1").value != "0") {
                        caseyear = $("#drpYear1").val();
                    }
                    else {
                        alert("please select the Matter Year.");
                        return;
                    }
                }
                var mattername = $("#Modalmattername").val();
                if (mattername == "" || mattername == null || mattername == undefined) {
                    alert("Please enter the matter name.");
                    return;
                }
                var matterTypeName = ""
                matterTypeName = $("#drptypeMH option:selected").text();

                sideIds = vside;
                stampRegs = stampReg;
                vBenchMH = vBench;
                formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", vBench, vside, stampReg, "", "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                    "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");

            }
        }

        else {
            caseTypes = $("#drptype").val();
            if (caseTypes == "0" || caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                alert("Please select the Matter Type");
                return;
            }
            if (document.getElementById("txtno1").value == "" || document.getElementById("txtno1").value == undefined || document.getElementById("txtno1").value == null) {
                alert("please enter the Matter Number");
                return;
            }
            else {
                caseNo = $("#txtno1").val();
            }

            if (document.getElementById("drpYear1").value != "0") {
                caseyear = $("#drpYear1").val();
            }
            else {
                alert("please select the Matter Year.");
                return;
            }
            var mattername = $("#Modalmattername").val();
            if (mattername == "" || mattername == null || mattername == undefined) {
                alert("Please enter the matter name.");
                return;
            }
            var matterTypeName = ""
            matterTypeName = $("#drptype option:selected").text();
            formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, othercourttxt,
                "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
        }
    }

    else if (vCourtType == "3") // District court section
    {

        drpcourtname = $("#drpcourtnameDC1").val();
        if (iscnrrequest == "1") {
            drpcourtname = ""
            drpcourtname = $("#drpcourtnameDC1Cnr").val();
            var drpdcourtcnr1 = $("#drpdcourtcnr1").val();

            if (drpdcourtcnr1 == "") {
                alert("Please enter cnr no.");
                document.getElementById('drpdcourtcnr1').focus();
                document.getElementById('drpdcourtcnr1').style.border = "1px solid red";
                return false;
            }

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
            var mattername = $("#Modalmattername").val();
            if (mattername == "" || mattername == null || mattername == undefined) {
                alert("Please enter the matter name.");
                return;
            }
            formData = AddManualCaseFormData(drpcourtname, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, drpcourtname, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", "", "", drpdcourtcnr1, "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
        }
        else {
            var vDistrict = "";
            caseNo = "";
            caseyear = "";
            caseTypes = "";
            var DistrictCourt = "";
            var CourtEstablishment = "";
            if (drpcourtname == "0" || drpcourtname == "" || drpcourtname == undefined || drpcourtname == null) {
                alert("Please select the  State/UT.")
                return;
            }
            vDistrict = $("#drpdistrictcourtname1").val();

            if (vDistrict == "0" || vDistrict == "" || vDistrict == undefined || vDistrict == null) {
                alert("Please select the  District .")
                return;
            }
            CourtEstablishment = $("#drpcourtcomplexestb1").val();


            if (CourtEstablishment == "0" || CourtEstablishment == "" || CourtEstablishment == undefined || CourtEstablishment == null) {
                alert("Please select the  Court Establishment.")
                return;
            }
            DistrictCourt = $("#drpcompestbcourt1").val();
            if (DistrictCourt == "0" || DistrictCourt == "" || DistrictCourt == undefined || DistrictCourt == null) {
                alert("Please select the  District Court.")
                return;
            }
            caseTypes = $("#drptype").val();
            if (caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                alert("Please select the  Matter Type.")
                return;
            }
            caseNo = $("#txtno1").val();
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the  Matter Number.")
                return;
            }
            caseyear = $("#drpYear1").val();
            if (caseyear == "" || caseyear == undefined || caseyear == null) {
                alert("Please  Select the Matter Year .")
                return;
            }
            var mattername = $("#Modalmattername").val();
            if (mattername == "" || mattername == null || mattername == undefined) {
                alert("Please enter the matter name.");
                return;
            }
            var matterTypeName = ""
            matterTypeName = $("#drptype option:selected").text();
            var districtothercourt = $("#drpcompestbcourt1 option:selected").text();
            var districtcourtsatate = $("#drpcourtnameDC1 option:selected").text();
            var districtcourtdistrict = $("#drpdistrictcourtname1 option:selected").text();

            formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, drpcourtname, vDistrict, CourtEstablishment, DistrictCourt, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", matterTypeName, "",
                districtothercourt, districtcourtsatate, districtcourtdistrict, "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
        }

    }
    else if (vCourtType == "4") // Tribunal court section
    {
        drpcourtname = $("#drpcourtname1").val();
        if (drpcourtname == "0" || drpcourtname == "" || drpcourtname == undefined || drpcourtname == null) {
            alert("Please select the  Court Name.")
            return;
        }

        if (drpcourtname == "CF") {
            caseNo = $("#txtno2").val();
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the Appeal Number.");
                return;
            }
            vBench = $("#CFBench1").val();
            if (vBench == "" || vBench == undefined || vBench == null) {
                alert("Please select the Bench");
                return;
            }
            if (vBench == "B") {
                var mattername = $("#Modalmattername").val();
                if (mattername == "" || mattername == null || mattername == undefined) {
                    alert("Please enter the matter name.");
                    return;
                }
                formData = AddManualCaseFormData(drpcourtname, caseNo, "0", "0", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", othercourttxt,
                    "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");

            }
            else if (vBench == "C") {
                var state = $("#drpncdrcstate1").val();
                if (state == "0" || state == "" || state == undefined || state == null) {
                    alert("Please select the State");
                    return;
                }
                var mattername = $("#Modalmattername").val();
                if (mattername == "" || mattername == null || mattername == undefined) {
                    alert("Please enter the matter name.");
                    return;
                }
                formData = AddManualCaseFormData(drpcourtname, caseNo, "0", "0", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", state, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", othercourttxt,
                    "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
            }
            else if (vBench == "E") {
                var state = $("#drpncdrcstate1").val();
                if (state == "0" || state == "" || state == undefined || state == null) {
                    alert("Please select the State");
                    return;
                }
                var district = $("#drpncdrcDistrict1").val();
                if (district == "0" || district == "" || district == undefined || district == null) {
                    alert("Please select the District");
                    return;

                }
                var mattername = $("#Modalmattername").val();
                if (mattername == "" || mattername == null || mattername == undefined) {
                    alert("Please enter the matter name.");
                    return;
                }
                formData = AddManualCaseFormData(drpcourtname, caseNo, "0", "0", "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", state, district, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", othercourttxt,
                    "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
            }
            else;
        }
        else if (drpcourtname == "DT") {

            var matterType = $("#divSCDECD1").val();
            if (matterType == "" || matterType == undefined || matterType == null) {
                alert("Please select the CaseType / Diary");
                return;
            }
            caseyear = "";
            caseTypes = "";
            vBench = "";
            caseNo = "";
            if (matterType == "0") {

                vBench = $("#divBench").val();
                caseTypes = $("#drptypeBench").val();
                caseNo = $("#txtno1").val();
                caseyear = $("#drpYear1").val();
                if (vBench == "" || vBench == undefined || vBench == null) {
                    alert("Please select the Bench");
                    return;
                }
                if (caseTypes == "0" || caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                    alert("Please select the Matter Type.");
                    return;
                }
                if (caseNo == "" || caseNo == undefined || caseNo == null) {
                    alert("Please enter the Matter Number.");
                    return;
                }
                if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                    alert("Please select the Matter Year.");
                    return;
                }
                var mattername = $("#Modalmattername").val();
                if (mattername == "" || mattername == null || mattername == undefined) {
                    alert("Please enter the matter name.");
                    return;
                }
                formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", othercourttxt,
                    "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
            }
            else if (matterType == "1") {
                vBench = $("#divBenchDt").val();
                caseNo = $("#txtDiaryNo1").val();
                caseyear = $("#drpYear1").val();
                caseTypes = $("#divSCDECD1").val();
                if (vBench == "" || vBench == undefined || vBench == null) {
                    alert("Please select the Bench");
                    return;
                }
                if (caseNo == "" || caseNo == undefined || caseNo == null) {
                    alert("Please enter the Dairy Number.");
                    return;
                }
                if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                    alert("Please select the Matter Year.");
                    return;
                }
                var mattername = $("#Modalmattername").val();
                if (mattername == "" || mattername == null || mattername == undefined) {
                    alert("Please enter the matter name.");
                    return;
                }
                formData = AddManualCaseFormData(drpcourtname, "", caseTypes, caseyear, "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                    caseNo, vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", othercourttxt,
                    "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
            }
            else;

        }
        else if (drpcourtname == "OERC") {
            caseNo = $("#txtno1").val();
            caseyear = $("#drpYear1").val();
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the Matter Number.");
                return;
            }
            if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                alert("Please select the Matter Year.");
                return;
            }
            var mattername = $("#Modalmattername").val();
            if (mattername == "" || mattername == null || mattername == undefined) {
                alert("Please enter the matter name.");
                return;
            }
            formData = AddManualCaseFormData(drpcourtname, caseNo, "0", caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", othercourttxt,
                "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
        }
        else if (drpcourtname == "CI" || drpcourtname == "IT" || drpcourtname == "CT" || drpcourtname == "CE" || drpcourtname == "NL" || drpcourtname == "NC" || drpcourtname == "NGT" || drpcourtname == "RC" || drpcourtname == "GS") {
            vBench = $("#divBench").val();
            caseTypes = $("#drptypeBench").val();
            caseNo = $("#txtno1").val();
            caseyear = $("#drpYear1").val();
            if (vBench == "" || vBench == undefined || vBench == null) {
                alert("Please select the Bench");
                return;
            }
            if (caseTypes == "0" || caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                alert("Please select the Matter Type.");
                return;
            }
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the Matter Number.");
                return;
            }
            if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                alert("Please select the Matter Year.");
                return;
            }
            var mattername = $("#Modalmattername").val();
            if (mattername == "" || mattername == null || mattername == undefined) {
                alert("Please enter the matter name.");
                return;
            }
            formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", vBench, "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", othercourttxt,
                "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
        }
        else {
            caseTypes = $("#drptype").val();
            caseNo = $("#txtno1").val();
            caseyear = $("#drpYear1").val();
            if (caseTypes == "0" || caseTypes == "" || caseTypes == undefined || caseTypes == null) {
                alert("Please select the Matter Type.");
                return;
            }
            if (caseNo == "" || caseNo == undefined || caseNo == null) {
                alert("Please enter the Matter Number.");
                return;
            }
            if (caseyear == "0" || caseyear == "" || caseyear == undefined || caseyear == null) {
                alert("Please select the Matter Year.");
                return;
            }
            var mattername = $("#Modalmattername").val();
            if (mattername == "" || mattername == null || mattername == undefined) {
                alert("Please enter the matter name.");
                return;
            }
            formData = AddManualCaseFormData(drpcourtname, caseNo, caseTypes, caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", othercourttxt,
                "", "", "", "", "", "", "", "", "", "", mattername, $("#addtaskmemberManual").val(), "", "", "", "42", "", "", "");
        }


    }

    else if (vCourtType == "5") {
        var caseName = "";
        var Addvocate = "";
        drpcourtname = $("#drpcourtname1").val();
        if (drpcourtname == "" || drpcourtname == null || drpcourtname == undefined || drpcourtname == "0") {
            alert("Please select the court name.");
            return;
        }
        caseNo = "";
        caseNo = $("#txtnoAdd1").val();
        caseyear = $("#drpYearAdd").val();

        caseName = $("#txtcasename").val();

        Addvocate = $("#txtcustomadvocate1").val();
        if (Addvocate == undefined) {
            Addvocate = "";
        }

        var nhd = $("#dtnhearingdate1").val();

        var status = $("#txtcustomstatus1").val();

        var mattername = $("#mattersAdd").val();
        if (caseNo == "" || caseNo == null || caseNo == undefined) {
            alert("Enter the Matter Number");
            return;
        }
        if (caseyear == "" || caseyear == null || caseyear == undefined || caseyear == "0") {
            alert("Please select the Matter Year.");
            return;
        }
        if (caseName == "" || caseName == null || caseName == undefined) {
            alert("Enter the Case Name.");
            return;
        }
        if (nhd == "" || nhd == null || nhd == undefined) {
            alert("Enter the Next Hearing / Disposed Date.");
            return;
        }
        if (mattername == "" || mattername == null || mattername == undefined) {
            alert("Enter the Matter Name");
            return;
        }
        formData = AddManualCaseFormData(drpcourtname, caseNo, "", caseyear, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
            "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", othercourttxt,
            "", "", "", "", "", "", caseName, nhd, Addvocate, status, mattername, $("#addtaskmember4").val(), "", "", "", "42", "", "", "");

    }
    else if (vCourtType == "6") {

        var caseName = "";
        var Addvocate = ""
        drpcourtname = "RevenueCourt1";
        var revCourtName = $("#drpcourtname1").val();
        var RevenueMandal1 = $("#RevenueMandal1").val();
        var RevenueJanpad1 = $("#RevenueJanpad1").val();

        var RevenueTahsil1 = $("#RevenueTahsil1").val();

        var RevenueCourtName1 = $("#RevenueCourtName1").val();

        var Revenuetxtno = $("#Revenuetxtno1").val();

        var mattersRevnue = $("#mattersRevnue").val();

        var RevenueYear1 = $("#RevenueYear1").val();

        var RevenueRefNo = $("#RevenueRefNo1").val();
        var RevenueJanpad = $("#RevenueJanpadR").val();
        var RevenueTahsil = $("#RevenueTahsilR").val();
        var RevenueCourtName = $("#RevenueCourtNameR").val();
        if (revCourtName == "0" || revCourtName == "" || revCourtName == undefined || revCourtName == null) {
            alert("Please select the Court.");
            return;
        }
        if (revCourtName == 'RERH') {

            if (!validateFields()) {
                return; // exit if validation fails  drpcourtname1
            }
            else {
                Revenuetxtno = $("#RevenuetxtnoR").val();
                mattersRevnue = $("#Modalmattername").val();
                formData = AddManualCaseFormData(drpcourtname, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", revCourtName, "", RevenueJanpad, RevenueTahsil, RevenueCourtName, Revenuetxtno, "", "", "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", mattersRevnue, $("#addtaskmember4").val(), "", "", "", "42", "", "", "");
            }
        }
        else if (revCourtName == 'RELK') {
            if (RevenueRefNo == "" || RevenueRefNo == null || RevenueRefNo == undefined) {
                if (RevenueMandal1 == "" || RevenueMandal1 == null || RevenueMandal1 == undefined) {
                    alert("Please select the Mandal.");
                    return;
                }
                if (RevenueJanpad1 == "" || RevenueJanpad1 == null || RevenueJanpad1 == undefined) {
                    alert("Please select the Janpad .");
                    return;
                }
                if (RevenueTahsil1 == "" || RevenueTahsil1 == null || RevenueTahsil1 == undefined) {
                    alert("Please select the Tahsil.");
                    return;
                }
                if (RevenueCourtName1 == "" || RevenueCourtName1 == null || RevenueCourtName1 == undefined) {
                    alert("Please select the Revenue Court.");
                    return;
                }
                if (Revenuetxtno == "" || Revenuetxtno == null || Revenuetxtno == undefined) {
                    alert("Please enter the Matter Number.");
                    return;
                }
                if (RevenueYear1 == "" || RevenueYear1 == null || RevenueYear1 == undefined || RevenueYear1 == "0") {
                    alert("Please select the Matter Year.");
                    return;
                }
                if (mattersRevnue == "" || mattersRevnue == null || mattersRevnue == undefined) {
                    alert("Please enter the Matter Name.");
                    return;
                }
                formData = AddManualCaseFormData(drpcourtname, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", revCourtName, RevenueMandal1, RevenueJanpad1, RevenueTahsil1, RevenueCourtName1, Revenuetxtno, RevenueYear1, RevenueRefNo, "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", mattersRevnue, $("#addtaskmember4").val(), "", "", "", "42", "", "", "");
            }
            else {
                if (mattersRevnue == "" || mattersRevnue == null || mattersRevnue == undefined) {
                    alert("Please enter the Matter Name.");
                    return;
                }
                formData = AddManualCaseFormData(drpcourtname, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                    "", vCourtType, "", "", "", "", "", "", "", revCourtName, "", "", "", "", "", "", RevenueRefNo, "", "", "", "", "", "", "", "",
                    "", "", "", "", "", "", "", "", "", "", mattersRevnue, $("#addtaskmember4").val(), "", "", "", "42", "", "", "");
            }
        }


    }
    else if (vCourtType == "7") {
        drpcourtname = "ReraCourt";
        var drpcourtname1 = $("#drpcourtname1").val();
        var reracasetype1 = $("#reracasetype1").val();
        var reracasno1 = $("#reracasno1").val();
        var reracaseyear1 = $("#reracaseyear1").val();
        var reraMatterName = $("#reraMatterName").val();
        if (drpcourtname1 == "" || drpcourtname1 == null || drpcourtname1 == undefined || drpcourtname1 == "0") {
            alert("Please select the Court Name");
            return;
        }
        if (drpcourtname1 == "MHRERA") {
            if (reracasno1 == "" || reracasno1 == null || reracasno1 == undefined) {
                alert("Please enter the Case/Appeal No.");
                return;
            }
            if (reraMatterName == "" || reraMatterName == null || reraMatterName == undefined) {
                alert("Enter the Matter Name");
                return;
            }
            formData = AddManualCaseFormData(drpcourtname, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", drpcourtname1, "", reracasno1, "", "", "", "", "",
                "", "", "", "", "", "", "", "", "", "", reraMatterName, $("#addtaskmember4").val(), "", "", "", "42", "", "", "");

        }
        else {
            if (reracasetype1 == "" || reracasetype1 == null || reracasetype1 == undefined || reracasetype1 == "0") {
                alert("Please select the Case/Appeal Authority.");
                return;
            }
            if (reracasno1 == "" || reracasno1 == null || reracasno1 == undefined) {
                alert("Please enter the Case/Appeal No.");
                return;
            }
            if (reracaseyear1 == "" || reracaseyear1 == null || reracaseyear1 == undefined || reracaseyear1 == "0") {
                alert("Please enter the Case Year.");
                return;
            }
            formData = AddManualCaseFormData(drpcourtname, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
                "", vCourtType, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", drpcourtname1, reracasetype1, reracasno1, reracaseyear1, "", "", "", "",
                "", "", "", "", "", "", "", "", "", "", reraMatterName, $("#addtaskmember4").val(), "", "", "", "42", "", "", "");
        }
    }
    $('#myOverlayRERH').show();
    revCourtName == 'RERH' ? openloadCW1() : '';
    var lasturl = mid && mid.trim() != "" ? "/api/MatterApi/DirectAddCaseToCW" : "/api/MatterApi/AddCaseLiveUpdateToCW"
    $.ajax(
        {
            type: "POST",
            url: lasturl, // Controller/View
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "Sorry! Unable to Add now.") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Sorry! Unable to Add Case.',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW1();
                }
                else if (data.Data == "Already Exists User Please Try Another User Name!") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'User ID is already exists. Please Try Another User ID !',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW1();
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
                    closeloadCW1();
                }
                else if (data.Data == "livecasenotactive") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Please subscribe for Case live update from e-Courts.',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW1();
                }
                else if (data.Data == "livecaseaccessdenied") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'You are not authorized to access add case for live update from e-Courts',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW1();
                }
                else if (data.Data == "Exist") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Matter Detail Already Exists!!',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW1();
                }
                else if (data.Data == "Case entry Limit Exceeded, Please upgrade your plan.") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Case entry Limit Exceeded, Please upgrade your plan.',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW1();
                }
                else if (data.Data == "Already exist matter name. please try another matter name") {
                    new PNotify({
                        title: 'Warning!',
                        text: 'Matter name already exists. Please try new name.',
                        type: 'error',
                        delay: 3000
                    });
                    closeloadCW1();
                }
                else {
                    if (data.Data == "false") {
                        new PNotify({
                            title: 'Warning!',
                            text: 'This matter is already exists.',
                            type: 'error',
                            delay: 3000
                        });
                        closeloadCW1();
                    }
                    else if (data.Data == "success") {
                        new PNotify({
                            title: 'Success!',
                            text: ' case saved successfully',
                            type: 'success',
                            delay: 3000
                        });
                        closeloadCW1();
                        sessionStorage.setItem("directAddCW", "1");

                        RestValue();
                        var fcode5 = localStorage.getItem("FirmCode");
                        if (hsmklitigation == "display:unset" && dashmatter == "display:unset") {
                            location.reload();

                            //window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                        }
                        else if (hsmklitigation == "display:unset" && dashmatter == "display:none") {
                            // window.location = encodeURI("/" + fcode5 + "/CW/LitigationCaseList");
                            location.reload();
                        }
                        else {
                            location.reload();
                            //window.location = encodeURI("/" + fcode5 + "/Firm/StandardCaseList");
                        }
                        // window.location = encodeURI("/" + fcode5 + "/CW/LitigationCaseList");
                    }
                    else {
                        alert(data.Data);
                        closeloadCW1();
                    }
                }
            },
            failure: function (data) {
                alert(data.responseText);
                closeloadCW1();
            },
            error: function (data) {
                alert(data.responseText);
                closeloadCW1();
            }
        });


}




function AddManualCaseFormData(drpcourtname, txtno, drptype, drpYear, txtFileNo, drpKAbench, drpGoa, drpbench, drpside, drpstampregister, drpNCBench, divTNBench, divRHBench,
    divJKBench, divBHBench, divMPBench, divUPBench, divGHBench, divWBBench, casedetails
    , txtDiaryNo, divSCHCDistrict, drpcourtnameDC, drpdistrictcourtname, drpcourtcomplexestb, drpcompestbcourt, drpncdrcstate, drpncdrcDistrict, txtsuffix, RevenueCourt
    , RevenueMandal, RevenueJanpad, RevenueTahsil, RevenueCourtName, Revenuetxtno, RevenueYear, RevenueRefNo, ReraCourt, reracasetype, reracasno, reracaseyear, reraRefNo,
    drpdistrictcourtfullname
    , mattertypetext, othercourttxt, districtothercourt, districtcourtsatate, districtcourtdistrict, drpdcourtcnr1, caseinfo, matterid, txtcasename, dtnhearingdate,
    txtcustomadvocate, txtcustomstatus, mattersforlink21, assignuser
    , checkclient, usertypes, confirmPassword, casecasetype, odate, clientname, newcompanyid
) {

    let formData = new FormData();

    formData.append("drpcourtname", EncodeText(drpcourtname));
    formData.append("txtno", EncodeText(txtno));
    formData.append("drptype", EncodeText(drptype));
    formData.append("drpYear", EncodeText(drpYear));
    formData.append("txtFileNo", EncodeText(txtFileNo));
    formData.append("drpKAbench", EncodeText(drpKAbench));
    formData.append("drpGoa", EncodeText(drpGoa));
    formData.append("drpbench", EncodeText(drpbench));
    formData.append("drpside", EncodeText(drpside));
    formData.append("drpstampregister", EncodeText(drpstampregister));
    formData.append("drpNCBench", EncodeText(drpNCBench));
    formData.append("divTNBench", EncodeText(divTNBench));
    formData.append("divRHBench", EncodeText(divRHBench));
    formData.append("divJKBench", EncodeText(divJKBench));
    formData.append("divBHBench", EncodeText(divBHBench));
    formData.append("divMPBench", EncodeText(divMPBench));
    formData.append("divUPBench", EncodeText(divUPBench));
    formData.append("divGHBench", EncodeText(divGHBench));
    formData.append("divWBBench", EncodeText(divWBBench));
    formData.append("casedetails", EncodeText(casedetails));
    formData.append("txtDiaryNo", EncodeText(txtDiaryNo));
    formData.append("divSCHCDistrict", EncodeText(divSCHCDistrict));
    formData.append("drpcourtnameDC", EncodeText(drpcourtnameDC));
    formData.append("drpdistrictcourtname", EncodeText(drpdistrictcourtname));
    formData.append("drpcourtcomplexestb", EncodeText(drpcourtcomplexestb));
    formData.append("drpcompestbcourt", EncodeText(drpcompestbcourt));
    formData.append("drpncdrcstate", EncodeText(drpncdrcstate));
    formData.append("drpncdrcDistrict", EncodeText(drpncdrcDistrict));
    formData.append("txtsuffix", EncodeText(txtsuffix));
    formData.append("RevenueCourt", EncodeText(RevenueCourt));
    formData.append("RevenueMandal", EncodeText(RevenueMandal));
    formData.append("RevenueJanpad", EncodeText(RevenueJanpad));
    formData.append("RevenueTahsil", EncodeText(RevenueTahsil));
    formData.append("RevenueCourtName", EncodeText(RevenueCourtName));
    formData.append("Revenuetxtno", EncodeText(Revenuetxtno));
    formData.append("RevenueYear", EncodeText(RevenueYear));
    formData.append("RevenueRefNo", EncodeText(RevenueRefNo));
    formData.append("ReraCourt", EncodeText(ReraCourt));
    formData.append("reracasetype", EncodeText(reracasetype));
    formData.append("reracasno", EncodeText(reracasno));
    formData.append("reracaseyear", EncodeText(reracaseyear));
    formData.append("reraRefNo", EncodeText(reraRefNo));
    formData.append("drpdistrictcourtfullname", EncodeText(drpdistrictcourtfullname));
    formData.append("mattertypetext", EncodeText(mattertypetext));
    formData.append("othercourttxt", EncodeText(othercourttxt));
    formData.append("districtothercourt", EncodeText(districtothercourt));
    formData.append("districtcourtsatate", EncodeText(districtcourtsatate));
    formData.append("districtcourtdistrict", EncodeText(districtcourtdistrict));
    formData.append("drpdcourtcnr1", EncodeText(drpdcourtcnr1));
    formData.append("caseinfo", EncodeText(caseinfo));
    formData.append("matterid", EncodeText(mid));
    formData.append("txtcasename", EncodeText(txtcasename));
    formData.append("dtnhearingdate", EncodeText(dtnhearingdate));
    formData.append("txtcustomadvocate", EncodeText(txtcustomadvocate));
    formData.append("txtcustomstatus", EncodeText(txtcustomstatus));
    formData.append("mattersforlink21", EncodeText(mattersforlink21));
    formData.append("assignuser", EncodeText(assignuser));
    formData.append("checkclient", EncodeText(checkclient));
    formData.append("usertypes", EncodeText(usertypes));
    formData.append("confirmPassword", EncodeText(confirmPassword));
    formData.append("casecasetype", EncodeText(casecasetype));
    formData.append("odate", EncodeText(odate));
    formData.append("clientname", EncodeText(clientname));
    formData.append("newcompanyid", EncodeText(newcompanyid));
    return formData;
}




function openloadCW() {
    $("#myOverlay").css("display", "block");
}
function closeloadCW() {
    $("#myOverlay").css("display", "none");
}


function openloadCW1() {
    $("#myOverlay1").css("display", "block");
}
function closeloadCW1() {
    $("#myOverlay1").css("display", "none");
    $('#myOverlayRERH').hide();
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
    flagOff += 1;
    $('#AppealModalInformation').modal({ show: true });
}

function closeModalAppeal() {
    $('#AppealModalInformation').modal('hide');
}



function RestValue() {
    location.reload();
}

//For CnrSection

function AddCourtNameCnr() {
    $("#drpcourtnameDC1Cnr").empty();
    var strcourttype = "3";
    $.ajax({
        type: "POST",
        url: "/AddCase/AddCourtNameByCourtType?courttype=3",
        dataType: "json",
        success: function (data) {
            $("#drpcourtnameDC1Cnr").append("<option value='0'>Select Your State / UT</option>");
            for (var i = 0; i < data.length; i++) {
                if (strcourttype != "3") {
                    $("#drpcourtname1").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
                else {
                    $("#drpcourtnameDC1Cnr").append("<option value='" + data[i].courtid + "'>" + data[i].courtname + "</option>");
                }
            }
        },
        error: function (data) {
        }
    });
}

function cnrvalidation() {
    if (iscnrrequest == "1") {
        document.getElementById("HighCourtType").style.display = 'none';
        document.getElementById("PrimeCourt").style.display = 'none';
        document.getElementById("AddaCourtArea").style.display = 'none';
        document.getElementById("RevnuewArea").style.display = 'none';
        document.getElementById("ReraCourtArea").style.display = 'none';
        document.getElementById("MemberFortempCourt").style.display = 'none';
        document.getElementById("CnrSection").style.display = 'block';
        document.getElementById("MaincaseCourt").style.display = 'block';
        document.getElementById("optionalCourt").style.display = "none";
        AddCourtNameCnr();

    }
}

function ModelMatterNameReset() {
    $("#Modalmattername").val("");
    addtaskmember4();

}
function validateFields() {
    const fields = [
        { selector: "#RevenueJanpadR", message: "Please select the Janpad." },
        { selector: "#RevenueTahsilR", message: "Please select the Tahsil." },
        { selector: "#RevenueCourtNameR", message: "Please select the RevenueCourt." },
        { selector: "#RevenuetxtnoR", message: "Please enter the Appeal No." },
        { selector: "#Modalmattername", message: "Please enter the Matter Name." }

    ];

    for (let field of fields) {
        const value = $(field.selector).val();
        if (!value || value.trim() === "") {
            alert(field.message);
            $(field.selector).focus(); // optional: highlight the invalid field
            return false;
        }
    }
    return true;
}
