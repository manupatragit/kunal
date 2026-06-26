var companycountdata = 0;
var editcountdata = 0;
var countdata = 0;
/*Search post details*/
function SearchPostDetails(trackingId) {
    if (trackingId == "") {
        alert("No Consignment No. found.")
        return false;
    }
    var formData = new FormData();
    formData.append("paramtrakingId", EncodeText(trackingId));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/ViewNoticePostDetail',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            if (response.Data != null) {
                if (response.Data.vImagepath != null && response.Data.vImagepath != "" && response.Data.vImagepath != "null") {
                    window.open(response.Data.vImagepath, '_blank');
                }
                else {
                    alert("Fetching Details is in progress...,it will take some time please wait.");
                }
            }
            else {
                alert("Fetching Details is in progress...,it will take some time please wait.");
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
function formatDate(date) {
    var str_array = date.split('/');
            year = str_array[2];
            month = str_array[1]
            day = str_array[0]
    return [year, month, day].join('-');
}
var noticeIdForPost = "";
/*Get notice post details*/
function fnfillNoticePostDetails(paramnoticeid,trackingId, consignmentnum, consigndate) {
    noticeIdForPost = paramnoticeid;
    $("#noticeSendDate").val();
    if (consigndate != null && consigndate != "1900-01-01T00:00:00" && consigndate != undefined && consigndate != "") {
        $("#noticeSendDate").val(formatDate(consigndate));
    }
    $("#trackingId").val(trackingId);
    $("#consignmentnum").val(consignmentnum);
    $("#noticePostModal").modal('show');
    if (trackingId != "" && trackingId != undefined) {
        $("#searchId").show();
        $("#btnsavepostDetail").text("Update")
    }
    else {
        $("#searchId").hide();
        $("#btnsavepostDetail").text("Save")
    }
}
function fnPostDetail() {
    var trakingId = $("#trackingId").val();
    SearchPostDetails(trakingId)
}
/*Save postal details*/
$("#btnsavepostDetail").click(function () {
    var noticepostdate = $("#noticeSendDate").val();
    var trakingId = $("#trackingId").val();
    var consignmentnum = $("#consignmentnum").val();
    if (noticepostdate == "") {
        alert("Please enter notice post date.")
        return false;
    }
    if (consignmentnum == "" || consignmentnum == null) {
        alert("Please enter consignment number.")
        return false;
    }
    if (consignmentnum != "") {
        if (consignmentnum.length > 25) {
            alert("Consignment No. can't be greater than 25 digit.")
            return false;
        }
        var str = consignmentnum;
        if (/^[a-zA-Z0-9-]*$/.test(str) == false) {
            alert('Only Alphanumeric characters allowed.');
            return false;
        }
    }
    var formData = new FormData();
    consignmentnum = consignmentnum.trim();
    formData.append("paramnoticepostdate", EncodeText(noticepostdate));
    formData.append("paramtrakingId", EncodeText(trakingId));
    formData.append("consignmentnum", EncodeText(consignmentnum));
    formData.append("paramnoticeid", EncodeText(noticeIdForPost));
    openload();
    $.ajax({
        type: "POST",
        url: '/NoticeTemplate/NoticePostDetail',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            closeload();
            if (response.status) {
                alert("Status updated successfully.");
                $('#noticePostModal').modal('hide');
                callapi();
                clearRecord();
            }
            else {
                alert(response.message);
            }
        },
        error: function (response) {
            closeload();
            alert("Something went wrong.")
        }
    })
})
function hidePostModal() {
    $('#noticePostModal').modal('hide');
    clearRecord();
}
function clearRecord() {
    $("#noticeSendDate").val("");
    $("#trackingId").val("");
    $("#consignmentnum").val("");
}
//Add more postal details
$(document).on("click", "#btn_addpostaldetails", function () {
    if (companycountdata < 5) {
        companycountdata += 1;
        var data = "";
        data += "<fieldset class='ec_bg'>";
        data += "<div class='row'>";
        data += "<div class='form-group col-md-4'>";
        data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Date of dispatch <span class='required' aria-required='true' style='color:red'><b>*</b></span></span></label>";
        data += " <div class='col-md-12'>";
        data += "<input autofocus='' class='form-control dateofdispatch inputFormat' type='date' value=''  name='noticeSendDate' id='noticeSendDate' autocomplete='new-text' />";
        data += "</div> ";
        data += "</div>";
        data += "<div class='form-group col-md-4'>";
        data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Consignment No.</span></label>";
        data += "<div class='col-md-12'>";
        data += " <input autofocus='' class='form-control consignmentno inputFormat' type='text' value='' name='consignmentnum' id='consignmentnum'  autocomplete='new-text'/>";
        data += "</div>";
        data += "</div>";
        data += "<div class='form-group col-md-4'>";
        data += " <label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Date of delivery <span class='required' aria-required='true' style='color:red'><b>*</b></span></span></label>";
        data += " <div class='col-md-12'>";
        data += "<input autofocus='' class='form-control dateofdelivery inputFormat' type='date' value=''  name='dateofdelivered' id='dateofdelivered' autocomplete='new-text' style='width:90%;float:left;' /><div onclick='delete_div($(this))' class='delete_div pull-right'><span  class='glyphicon glyphicon-trash' style='color: red; cursor: pointer;' title='Delete'></span></div>";
        data += " </div> ";
        data += "</div>";
        data += "</div>";
        data += " </fieldset>";
        $('#dvadd_noticepostdetils').append(data);
        $("#rowcounterdata").val('');
        $("#rowcounterdata").val(companycountdata);
    }
    else {
        alert("You Can't add more than 5 Consignment");
    }
});
//delete custom fields
function delete_div(data) {
    countdata = countdata - 1;
    companycountdata = companycountdata - 1;
    $("#rowcounterdata").val('');
    $("#rowcounterdata").val(companycountdata);
    data.parents('fieldset').remove();
}
