var requestpaged = requestpaged;
var MatterName = MatterName;
var MatterId = MatterId;
var sideIds = "";
var stampRegs = "";
var vBenchMH = "";
var cType = "";
$(document).ready(function () {
    FillCourtTypeConsumer();
    const urlParams = new URLSearchParams(window.location.search);

    /*const caseNo = urlParams.get('caseNo');*/
    const caseIdDetail = urlParams.get('caseIdDetail');
    if (caseIdDetail) {

        fillConsumerCasesByCaseNo(caseIdDetail);
    }
});
function FillCourtTypeConsumer() {
    $.ajax({
        async: true,
        type: "POST",
        url: "/Firm/FillCourt",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var option = '<option value="">--Select Court Detail--</option>';
            $.each(response, function (i, a) {
                option += '<option value="' + a["id"] + '" >  ' + a["courtname"] + '</option>';
            });
            $("#courtDetail").append(option);//End of foreach Loop
            //console.log(response);
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
}
function saveConsumerCases() {
    var matterId = $("#hdnMatterId").val();
    if (matterId == "") {
        matterId = null;
    }
    var data = {
        matterId: matterId,
        CaseNo: $("#txtcaseNo").val(),//$("#txtno1").val() || $("#caseNo").val(),
        CaseId: $("#caseId").val(),
        Zone: $("#zone").val(),
        Branch: $("#branch").val(),

        PetitionerName: $("#petitionerName").val(),
        CIFNo: $("#cifNo").val(),
        AccountNo: $("#accountNo").val(),

        FirstSummonDate: $("#firstSummonDate").val(),
        FirstSummonReceivedDate: $("#firstSummonReceivedDate").val(),

        RespondentDetails: $("#respondentDetails").val(),

        FilingDate: $("#filingDate").val(),
        PresentStatus: $("#presentStatus").val(),

        CourtDetail: $("#hdnCourtName").val(),//$("#divSCHCDistrict1").val() || $("#courtDetail").val(),
        PlaceOfCourt: $("#drpcourtname1").val() || $("#placeOfCourt").val(),

        ClaimAmount: $("#claimAmount").val(),
        CaseType: $("#drptype").val() || $("#caseType").val(),

        AreaOfComplaint: $("#areaOfComplaint").val(),
        FactsOfCase: $("#factsOfCase").val(),

        WrittenStatementDate: $("#writtenStatementDate").val(),

        NextHearingDate: $("#nextHearingDate").val(),
        NextHearingPurpose: $("#nextHearingPurpose").val(),

        InterimOrderDate: $("#interimOrderDate").val(),
        InterimOrderReceivedDate: $("#interimOrderReceivedDate").val(),

        InterimDirection: $("#interimDirection").val(),
        InterimComplianceStatus: $("#interimCompliance").val(),
        InterimRemarks: $("#interimRemarks").val(),

        DisposalDate: $("#disposalDate").val(),
        FinalOrderReceivedDate: $("#finalOrderReceivedDate").val(),

        AwardAmount: $("#awardAmount").val(),

        FinalDirection: $("#finalDirection").val(),
        FinalComplianceStatus: $("#finalCompliance").val(),
        FinalRemarks: $("#finalRemarks").val(),
        AdvocateName: $("#advocateName").val(),
        AdvocateContact: $("#advocateContact").val()
    };

    $.ajax({
        url: "/CW/SaveConsumerCases",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            alert("Data Added Successfully!");
            localStorage.setItem("filedbyField", "2")
            var fcode5 = localStorage.getItem("FirmCode");
            window.location = encodeURI("/" + fcode5 + "/CW/CustomDashboard");
            $("#ConsumerCases")[0].reset();
        },
        error: function (err) {
            console.log(err);
        }
    });
}
