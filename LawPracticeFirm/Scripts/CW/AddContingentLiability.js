var requestpaged = requestpaged;
var MatterName = MatterName;
var MatterId = MatterId;
var sideIds = "";
var stampRegs = "";
var vBenchMH = "";
var cType = "";
$(document).ready(function () {
    FillCourtTypeContingent();
    const urlParams = new URLSearchParams(window.location.search);

    //const caseNo = urlParams.get('caseNo');
    const caseIdDetail = urlParams.get('caseIdDetail');
    if (caseIdDetail) {

        loadContingentLiabilityByCaseNo(caseIdDetail);
    }
});



function FillCourtTypeContingent() {
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
            $("#divSCHCDistrict").append(option);//End of foreach Loop
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
function saveContingentLiability() {
    var matterId = $("#hdnMatterId").val();
    if (matterId == "") {
        matterId = null;
    }
    var data = {
        matterId: matterId,
            CaseId: $("#caseId").val(),
            CaseNo: $("#caseNo").val(),

            Zone: $("#zone").val(),
            Branch: $("#branch").val(),

            // Account / Claimant
            AccountHolderName: $("#accountHolderName").val(),
            ClaimantName: $("#claimantName").val(),
            ClaimantAddress: $("#claimantAddress").val(),

            // Claim Details
            DateOfClaim: $("#dateOfClaim").val(),

            // Claim breakup
            BankGuarantee: $("#bankGuarantee").val(),
            LetterOfCredit: $("#letterOfCredit").val(),
            WrongPayment: $("#wrongPayment").val(),
            Fraud: $("#fraud").val(),
            CounterClaim: $("#counterClaim").val(),
            OthersClaim: $("#othersClaim").val(),

            // Security & Facts
            NatureOfSecurity: $("#natureOfSecurity").val(),
            RealisableValue: $("#realisableValue").val(),

            FactsOfCase: $("#factsOfCase").val(),

            // Hearing
            NextHearingPurpose: $("#nextHearingPurpose").val(),
            NextHearingDate: $("#nextHearingDate").val(),

            // Provision
            ProvisionDetail: $("#provisionDetail").val(),
            YearOfProvision: $("#yearOfProvision").val(),

            AmountProvision: $("#amountProvision").val(),
            AmountDepositedInCourt: $("#amountDepositedInCourt").val()
    };

    $.ajax({
        url: "/CW/SaveContingentLiability",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            alert("Data Added Successfully!");
            $("#conLiabilityDetail")[0].reset();
            localStorage.setItem("filedbyField", "3")
            var fcode5 = localStorage.getItem("FirmCode");
            window.location = encodeURI("/" + fcode5 + "/CW/CustomDashboard");
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function calculateTotalClaim() {
    let total = 0;

    total += parseFloat($("#bankGuarantee").val()) || 0;
    total += parseFloat($("#letterOfCredit").val()) || 0;
    total += parseFloat($("#wrongPayment").val()) || 0;
    total += parseFloat($("#fraud").val()) || 0;
    total += parseFloat($("#counterClaim").val()) || 0;
    total += parseFloat($("#othersClaim").val()) || 0;

    return total;
}
