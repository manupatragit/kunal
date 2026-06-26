// LOAD ON PAGE LOAD
var requestpaged = requestpaged;
var MatterName = MatterName;
var MatterId = MatterId;
var sideIds = "";
var stampRegs = "";
var vBenchMH = "";
var cType = "";
$(document).ready(function () {
    //FillCourtTypeAgainst();
    const urlParams = new URLSearchParams(window.location.search);

    const caseIdDetail = urlParams.get('caseIdDetail'); //urlParams.get('caseNo');

    if (caseIdDetail) {

        fillAgainstTheBankCaseNo(caseIdDetail);
    }
});

function formatDate(value) {

    if (!value) return null;

    // Handle dd/MM/yyyy or dd-MM-yyyy
    var parts = value.split(/[\/-]/);

    if (parts.length === 3) {

        var day = parts[0];
        var month = parts[1] - 1;
        var year = parts[2];

        var d = new Date(year, month, day);

        if (isNaN(d.getTime())) {
            return null;
        }

        return d.toISOString();
    }

    // Fallback
    var d = new Date(value);

    if (isNaN(d.getTime())) {
        return null;
    }

    return d.toISOString();
}

function getValue(selector) {
    return $(selector).val() ?? '';
}

function saveAgainstBank() {
    //var model = {
    //    CaseNo: $("#txtno1").val() || $("#caseNo2").val(),
    //    CaseId: $("#caseId2").val(),
    //    Zone: $("#zone2").val(),
    //    Branch: $("#branch2").val(),

    //    AccountHolderName: $("#accountHolderName").val(),
    //    ClaimantAddress: $("#claimantDetails").val(),

    //    CIFNo: $("#cifNo2").val(),
    //    AccountNo: $("#accountNo2").val(),

    //    FirstSummonDate: $("#firstSummonDate2").val(),
    //    FirstSummonReceivedDate: $("#firstSummonReceivedDate2").val(),

    //    RespondentDetails: $("#respondentDetails2").val(),
    //    ProformaParties: $("#proformaParties").val(),

    //    CaseProposing: $("#caseProposing").val(),
    //    CaseType: $("#drptype").val() ||  $("#caseType2").val(),
    //    Department: $("#department").val(),

    //    CourtDetail: $("#divSCHCDistrict1").val() || $("#courtDetail2").val(),
    //    PlaceOfCourt: $("#drpcourtname1").val() ||'', //("#placeOfCourt2").val(),

    //    AreaOfComplaint: $("#complaintArea").val(),

    //    WrittenStatementDate: $("#writtenStatementDate2").val(),
    //    FactsOfCase: $("#factsReason").val(),

    //    ClaimAmount: $("#claimAmount2").val() || null,

    //    AdvocateName: $("#advocateName").val(),
    //    AdvocateContact: $("#advocateContact").val(),

    //    PresentStatus: $("#presentStatus2").val(),

    //    NextHearingDate: $("#nextHearingDate2").val(),
    //    NextHearingPurpose: $("#nextHearingPurpose2").val(),

    //    InterimOrderDate: $("#interimOrderDate2").val(),
    //    InterimOrderReceivedDate: $("#interimOrderReceivedDate2").val(),

    //    InterimDirection: $("#interimDirection2").val(),
    //    InterimComplianceStatus: $("#interimCompliance2").val(),
    //    InterimRemarks: $("#interimRemarks2").val(),

    //    DisposalDate: $("#disposalDate2").val(),
    //    FinalOrderReceivedDate: $("#finalOrderReceivedDate2").val(),

    //    AwardAmount: $("#awardAmount2").val() || null,

    //    FinalDirection: $("#finalDirection2").val(),
    //    FinalComplianceStatus: $("#finalCompliance2").val(),
    //    FinalRemarks: $("#finalRemarks2").val()
    //};
    var matterId = $("#hdnMatterId").val();
    if (matterId == "") {
        matterId = null;
    }
    var model = {
        MatterId: matterId,//$("#hdnMatterId").val(),
        CaseNo: getValue("#txtcaseno"),
        CaseId: getValue("#caseId2"),
        Zone: getValue("#zone2"),
        Branch: getValue("#branch2"),

        AccountHolderName: getValue("#accountHolderName"),
        ClaimantAddress: getValue("#claimantDetails"),

        CIFNo: getValue("#cifNo2"),
        AccountNo: getValue("#accountNo2"),

        FirstSummonDate: getValue("#firstSummonDate2"),
        FirstSummonReceivedDate: getValue("#firstSummonReceivedDate2"),

        RespondentDetails: getValue("#respondentDetails2"),
        ProformaParties: getValue("#proformaParties"),

        CaseProposing: getValue("#caseProposing"),
        CaseType: getValue("#drptype") || getValue("#caseType2"),
        Department: getValue("#department"),

        CourtDetail: $("#hdnCourtName").val(),
        PlaceOfCourt: getValue("#drpcourtname1"),

        AreaOfComplaint: getValue("#complaintArea"),

        WrittenStatementDate: getValue("#writtenStatementDate2"),
        FactsOfCase: getValue("#factsReason"),

        ClaimAmount: getValue("#claimAmount2"),

        AdvocateName: getValue("#advocateName"),
        AdvocateContact: getValue("#advocateContact"),

        PresentStatus: getValue("#presentStatus2"),

        NextHearingDate: getValue("#nextHearingDate2"),
        NextHearingPurpose: getValue("#nextHearingPurpose2"),

        InterimOrderDate: getValue("#interimOrderDate2"),
        InterimOrderReceivedDate: getValue("#interimOrderReceivedDate2"),

        InterimDirection: getValue("#interimDirection2"),
        InterimComplianceStatus: getValue("#interimCompliance2"),
        InterimRemarks: getValue("#interimRemarks2"),

        DisposalDate: getValue("#disposalDate2"),
        FinalOrderReceivedDate: getValue("#finalOrderReceivedDate2"),

        AwardAmount: getValue("#awardAmount2"),

        FinalDirection: getValue("#finalDirection2"),
        FinalComplianceStatus: getValue("#finalCompliance2"),
        FinalRemarks: getValue("#finalRemarks2")
    };

    $.ajax({
        url: "/CW/SaveAgainstBank",
        type: "POST",
        data: JSON.stringify(model),
        contentType: "application/json",
        success: function (res) {
            if (res.success) {
                alert("Data Added Successfully!");
                var fcode5 = localStorage.getItem("FirmCode");
                window.location = encodeURI("/" + fcode5 + "/CW/CustomDashboard");
                $("#AgainstTheBank")[0].reset();
            } 
        },
        error: function (err) {
            console.log(err);
        }
    });
}



