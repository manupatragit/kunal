$(document).ready(function () {
    var noticeId = sessionStorage.getItem("UpdateBulkNoticeId");
    GetBulkNoticeDetail(noticeId)
});
function GetBulkNoticeDetail(noticeId) {
    var formdata = new FormData();
    formdata.append("NoticeID", EncodeText(noticeId))
    $.ajax({
        type: "POST",
        url: "/NoticeNew/BulkNoticeDetailById",
        data: formdata,
        contentType: false,
        processData: false,
        success: function (data) {
            var obj = data.Data;
            $.each(obj, function (i, val) {
                $("#loantype").val(val.LoanType);
                $("#loanId").val(val.LoanID);
                $("#clientId").val(val.ClientID);
                $("#schoolStudentName").val(val.SchoolStudentName);
                $("#branch").val(val.Branch);
                $("#state").val(val.State);
                $("#branchaddress").val(val.BranchAddress);
                $("#productname").val(val.ProductName);
                $("#loanamount").val(val.LoanAmount);
                $("#emiAmount").val(val.EMIAmount);
                $("#currentDPD").val(val.CurrentDPD);
                $("#borrowerschoolname").val(val.BorrowerDetailsSchoolName1);
                $("#borrowerschooladdress").val(val.BorrowerDetailsSchooladdress11);
                $("#borrowerschoolphone").val(val.BorrowerDetailsSchoolphonenumber1);
                $("#borrowerschoolemail").val(val.BorrowerDetailsSchoolemailid1);
                $("#trustname").val(val.TrustDetailsTrustname1);
                $("#trustnameaddress").val(val.TrustDetailsTrustaddress1);
                $("#trustnamephoneno").val(val.TrustDetailsTrustphonenumber1);
                $("#trustemail").val(val.TrustDetailsTrustemailid1);
                $("#coapplicantname").val(val.CoApplicantName1);
                $("#coapplicantaddress").val(val.CoApplicant1Address);
                $("#coapplicantphone").val(val.CoApplicant1PhoneNumber);
                $("#coapplicantemail").val(val.CoApplicant1EmailID);
                $("#coapplicantname2").val(val.CoApplicantName2);
                $("#coapplicantaddress2").val(val.CoApplicant2Address);
                $("#coapplicantphone2").val(val.CoApplicant2PhoneNumber);
                $("#coapplicantemailid2").val(val.CoApplicant2EmailID);
                $("#coapplicantdunningref").val(val.DunningReferencenumber);
                $("#branchcollectionmanagername").val(val.BranchCollectionManagerName);
                $("#branchcollectionmanagerno").val(val.branchcollectionmanagername);
                $("#txtnoticetype").val(val.TypeofNotice);
                $("#disbursementdate").val((val.DisbursementDate == "" || val.DisbursementDate == null ? "" : convertToJsDate(val.DisbursementDate)));
                $("#emiduedate").val((val.EMIDueDate == "" || val.EMIDueDate == null ? "" : convertToJsDate(val.EMIDueDate)));
                $("#coapplicantdunningnoticedate").val((val.DunningletterNoticeDate == "" || val.DunningletterNoticeDate == null ? "" : convertToJsDate(val.DunningletterNoticeDate)));
            });
            
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
}
function convertToJsDate(dateStr) {
    const parts = dateStr.split(" ")[0].split("/");
    let dd = parts[1].padStart(2, '0');
    let mm = parts[0].padStart(2, '0');
    let yyyy = parts[2];
    return `${dd}/${mm}/${yyyy}`;
}

function submitNotice() {
    var noticeIdForUpdate = sessionStorage.getItem("UpdateBulkNoticeId");
    var loantype = $("#loantype").val();
    var loanId = $("#loanId").val();
    var clientId = $('#clientId').val();
    var schoolStudentName = $('#schoolStudentName').val();
    var branch = $('#branch').val();
    var state = $('#state').val();
    var branchaddress = $('#branchaddress').val();
    var productname = $('#productname').val();
    var loanamount = $('#loanamount').val();
    var disbursementdate = $('#disbursementdate').val();
    var emiAmount = $('#emiAmount').val();
    var emiduedate = $('#emiduedate').val();
    var currentDPD = $('#currentDPD').val();
    var borrowerschoolname = $("#borrowerschoolname").val();
    var borrowerschooladdress = $('#borrowerschooladdress').val();
    var borrowerschoolphone = $("#borrowerschoolphone").val();
    var borrowerschoolemail = $("#borrowerschoolemail").val();
    var trustname = $("#trustname").val();
    var trustnameaddress = $("#trustnameaddress").val();
    var trustnamephoneno = $("#trustnamephoneno").val();
    var trustemail = $("#trustemail").val();
    var coapplicantname = $("#coapplicantname").val();
    var coapplicantaddress = $("#coapplicantaddress").val();
    var coapplicantphone = $("#coapplicantphone").val();
    var coapplicantemail = $("#coapplicantemail").val();
    var coapplicantname2 = $("#coapplicantname2").val();
    var coapplicantaddress2 = $("#coapplicantaddress2").val();
    var coapplicantphone2 = $("#coapplicantphone2").val();
    var coapplicantemailid2 = $("#coapplicantemailid2").val();
    var coapplicantdunningref = $("#coapplicantdunningref").val();
    var coapplicantdunningnoticedate = $("#coapplicantdunningnoticedate").val();
    var branchcollectionmanagername = $("#branchcollectionmanagername").val();
    var branchcollectionmanagerno = $("#branchcollectionmanagerno").val();
    var txtnoticetype = $("#txtnoticetype").val();

    var formData = new FormData();
    formData.append("loantype", EncodeText(loantype));
    formData.append("loanId", EncodeText(loanId));
    formData.append("clientId", EncodeText(clientId));
    formData.append("schoolStudentName", EncodeText(schoolStudentName));
    formData.append("branch", EncodeText(branch));
    formData.append("state", EncodeText(state));
    formData.append("branchaddress", EncodeText(branchaddress));
    formData.append("productname", EncodeText(productname));
    formData.append("loanamount", EncodeText(loanamount));
    formData.append("disbursementdate", EncodeText(disbursementdate));
    formData.append("emiAmount", EncodeText(emiAmount));
    formData.append("emiduedate", emiduedate);
    formData.append("currentDPD", EncodeText(currentDPD));
    formData.append("borrowerschoolname", EncodeText(borrowerschoolname));
    formData.append("borrowerschooladdress", EncodeText(borrowerschooladdress));
    formData.append("borrowerschoolphone", EncodeText(borrowerschoolphone));
    formData.append("borrowerschoolemail", EncodeText(borrowerschoolemail));
    formData.append("trustname", EncodeText(trustname));
    formData.append("trustnameaddress", EncodeText(trustnameaddress));
    formData.append("trustnamephoneno", EncodeText(trustnamephoneno));
    formData.append("trustemail", EncodeText(trustemail));
    formData.append("coapplicantname", EncodeText(coapplicantname));
    formData.append("coapplicantaddress", EncodeText(coapplicantaddress));
    formData.append("coapplicantphone", EncodeText(coapplicantphone));
    formData.append("coapplicantemail", EncodeText(coapplicantemail));
    formData.append("coapplicantname2", EncodeText(coapplicantname2));
    formData.append("coapplicantaddress2", EncodeText(coapplicantaddress2));
    formData.append("coapplicantphone2", EncodeText(coapplicantphone2));
    formData.append("coapplicantemailid2", EncodeText(coapplicantemailid2));
    formData.append("coapplicantdunningref", EncodeText(coapplicantdunningref));
    formData.append("coapplicantdunningnoticedate", EncodeText(coapplicantdunningnoticedate));
    formData.append("branchcollectionmanagername", EncodeText(branchcollectionmanagername));
    formData.append("branchcollectionmanagerno", EncodeText(branchcollectionmanagerno));
    formData.append("txtnoticetype", EncodeText(txtnoticetype));
    formData.append("noticeId", EncodeText(noticeIdForUpdate));
    openload();
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/UpdateVerthnaNotice",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            closeload();
            new PNotify({
                title: 'Success!',
                text: 'Data update successfully',
                type: 'success',
                delay: 3000
            });
            sessionStorage.removeItem("UpdateBulkNoticeId");
            var firmcode = localStorage.getItem("FirmCode");
            window.location.href = "/" + firmcode + "/NoticeNew/UploadBulkData"
        },
        
    });
}

$(document).on("input", ".auto-date", function () {
    let val = $(this).val();
    val = val.replace(/[^\d]/g, "");
    if (val.length > 2 && val.length <= 4) {
        val = val.slice(0, 2) + "/" + val.slice(2);
    } else if (val.length > 4) {
        val = val.slice(0, 2) + "/" + val.slice(2, 4) + "/" + val.slice(4, 8);
    }
    $(this).val(val);
});
$(document).on("keydown", ".auto-date", function (e) {
    if (this.value.length >= 10 && e.key !== "Backspace" && e.key !== "Delete") {
        e.preventDefault();
    }
});
