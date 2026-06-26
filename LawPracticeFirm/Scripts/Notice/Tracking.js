var editcountdata = 0;
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
        success: function (response1) {
            var response = response1.Data;
            if (response != null) {
                if (response.vText != null && response.vText != "" && response.vText != "null") {
                    const winHtml = `<!DOCTYPE html>
                    <html>
                    <head>
                    <title>Window with Blob</title>
                    </head>
                    <body><style>
                    #postofficetrackdiv #ctl00_PlaceHolderMain_ucNewLegacyControl_lnkFAQ,#ctl00_PlaceHolderMain_ucNewLegacyControl_lblQuickHelp,#ctl00_PlaceHolderMain_ucNewLegacyControl_lblRequiredField{display:none}
                    #postofficetrackdiv h1{
                    text-align:center;
                    }
                    #postofficetrackdiv {
                    font-family: Arial, Helvetica, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                    }
                    #postofficetrackdiv .btn{display:none;}
                    #postofficetrackdiv table td, #postofficetrackdiv table th {
                    border: 1px solid #ddd;
                    padding: 8px;
                    }
                    #postofficetrackdiv table tr:nth-child(even){background-color: #f2f2f2;}
                    #postofficetrackdiv table tr:hover {background-color: #ddd;}
                    #postofficetrackdiv table{
                    width:100%;
                    }
                    #postofficetrackdiv table th {
                    padding-top: 5px;
                    padding-bottom: 5px;
                    text-align: left;
                    background-color: #aa042a;
                    color: white;
                    }
                    </style>
                    <div id="postofficetrackdiv">
           `+ response.vText + `   </div>     </body>
    </html>`;
                    const winUrl = URL.createObjectURL(
                        new Blob([winHtml], { type: "text/html" })
                    );
                    const win = window.open(
                        winUrl,
                        "win",
                        `width=800,height=400,screenX=200,screenY=200`
                    );
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
/*Fill notice postal detail for tracking*/
var noticeIdForPost = "";
function fnfillNoticePostDetails(paramnoticeid, trackingId, consignmentnum, consigndate) {
    editcountdata = 0;
    $('#dvadd_noticepostdetils').html('');
    if (paramnoticeid != "") {
        var formData = new FormData();
        formData.append("paramnoticeid", EncodeText(paramnoticeid));
        $.ajax({
            type: "POST",
            url: '/NoticeNew/ViewModeOfDeliveryByNoticeId',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                var obj = JSON.parse(response);
                $("#Modesofdeleverypost").multiselect({});
                if (obj.Deleverylist != null && obj.Deleverylist.length != 0) {
                    $.each(obj.Deleverylist, function (key, value) {
                        $("#Modesofdeleverypost").find("option[value=" + value.ModeofServiceDelivery + "]").prop("selected", "selected");
                    });
                    $("#Modesofdeleverypost").multiselect('reload');
                }
                else {
                    $("#Modesofdeleverypost").multiselect('destroy');
                    $("#Modesofdeleverypost").multiselect();
                }
                //bind post details
                if (obj.speddpostdetails != null && obj.speddpostdetails.length != 0) {
                    $.each(obj.speddpostdetails, function (k, value) {
                        if (k >= 1) {
                            if (value.NoticeSentToClientDate != null && value.NoticeSentToClientDate != "1900-01-01T00:00:00" && value.NoticeSentToClientDate != undefined && value.NoticeSentToClientDate != "") {
                                Noticesenddate = value.NoticeSentToClientDate.split("T");
                                Noticesenddate = Noticesenddate[0];
                            }
                            editcountdata += 1;
                            var data = "";
                            data += "<fieldset class='ec_bg'>";
                            data += "<div class='row'>";
                            data += "<div class='form-group col-md-4'>";
                            data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Date of dispatch <span class='required' aria-required='true' style='color:red'><b>*</b></span></span></label>";
                            data += " <div class='col-md-12'>";
                            if (value.DateofDelivery != null && value.DateofDelivery != "1900-01-01T00:00:00" && value.DateofDelivery != undefined && value.DateofDelivery != "") {
                                var DateofDeliveysd = value.DateofDelivery.split("T");
                                data += "<input autofocus='' class='form-control dateofdispatch inputFormat' type='date' value='" + DateofDeliveysd[0] + "'  name='noticeSendDate' id='noticeSendDate' autocomplete='new-text' />";
                            }
                            else {
                                data += "<input autofocus='' class='form-control dateofdispatch inputFormat' type='date' value=''  name='noticeSendDate' id='noticeSendDate' autocomplete='new-text' />";
                            }
                            data += "</div> ";
                            data += "</div>";
                            data += "<div class='form-group col-md-4'>";
                            data += "<label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Consignment No.</span></label>";
                            data += "<div class='col-md-12'>";
                            data += "<input type='hidden' class='trackingidss' id='trackingId' value='" + value.TrackingId + "' /> <input autofocus='' class='form-control consignmentno inputFormat' type='text'value='" + value.consignementnum + "' name='consignmentnum' id='consignmentnum'  autocomplete='new-text'/>";
                            data += "</div>";
                            data += "</div>";
                            data += "<div class='form-group col-md-4'>";
                            data += " <label class='formLabel colorDark' style='font-size: 12px !important; font-weight: 450 !important'><span class='control-label col-md-12'>Date of delivery <span class='required' aria-required='true' style='color:red'><b>*</b></span></span></label>";
                            data += " <div class='col-md-12'>";
                            if (value.NoticeSentToClientDate != null && value.NoticeSentToClientDate != "1900-01-01T00:00:00" && value.NoticeSentToClientDate != undefined && value.NoticeSentToClientDate != "") {
                                var Noticesenddate = value.NoticeSentToClientDate.split("T");
                                data += "<input autofocus='' class='form-control dateofdelivery inputFormat' type='date' value='" + Noticesenddate[0] + "'  name='dateofdelivered' id='dateofdelivered' autocomplete='new-text' style='width:90%;float:left;' />";
                            } else {
                                data += "<input autofocus='' class='form-control dateofdelivery inputFormat' type='date' value=''  name='dateofdelivered' id='dateofdelivered' autocomplete='new-text' style='width:90%;float:left;' />";
                            }
                            data += " </div> ";
                            data += "</div>";
                            data += "</div>";
                            data += " </fieldset>";
                            $('#dvadd_noticepostdetils').append(data);
                            $("#rowcounterdata").val('');
                            $("#rowcounterdata").val(editcountdata);
                        }
                        else {
                            if (value.DateofDelivery != null && value.DateofDelivery != "1900-01-01T00:00:00" && value.DateofDelivery != undefined && value.DateofDelivery != "") {
                                var DateofDelivegg = value.DateofDelivery.split("T");
                                $("#dateofdelivered").val(DateofDelivegg[0]);
                            }
                            if (value.NoticeSentToClientDate != null && value.NoticeSentToClientDate != "1900-01-01T00:00:00" && value.NoticeSentToClientDate != undefined && value.NoticeSentToClientDate != "") {
                                var dconsigndatess = value.NoticeSentToClientDate.split("T")
                                $("#noticeSendDate").val(dconsigndatess[0]);
                            }
                            $("#consignmentnum").val(value.consignementnum);
                            $("#trackingId").val(value.TrackingId);
                        }
                    });
                }
                else {
                    $("#Modesofdeleverypost").multiselect('reload');
                    $("#dateofdelivered").val('');
                }
            },
            error: function (response) {
                alert("Something went wrong.")
            }
        })
    }
    //END
    noticeIdForPost = paramnoticeid;
    $("#trackingId").val(trackingId);
    $("#noticePostModal").modal('show');
    if (trackingId != "" && trackingId != undefined) {
        $("#searchId").show();
        $("#btnsavepostDetail").text("Update")
        $("#btn_addpostaldetails").prop('disabled', true);
    }
    else {
        $("#searchId").hide();
        $("#btnsavepostDetail").text("Save");
    }
}
function fnPostDetail() {
    var trakingId = $("#trackingId").val();
    SearchPostDetails(trakingId)
}
$(document).on("change", "#Modesofdeleverypost", function () {
    var valuessd = $(this).val();
    $.each(valuessd, function (index) {
        var finalOutputs = valuessd[index];
        if (finalOutputs == "Post" || finalOutputs == "Courier") {
            $("#consignmentdivlayout").show();
        } else {
            $("#consignmentdivlayout").hide();
        }
    });
});
/*Save speed post details*/
$(document).on("click", "#btnsavepostDetail", function () {
    var invalid = true;
    var trakingId = $("#trackingId").val();
    var noticepostdate = "";
    var consignmentnum = "";
    var dateofdelivery = "";
    var Receiverrowcountdata = $("#rowcounterdata").val();
    var dateofdeliveryArray = "";
    var consignmentnoArray = "";
    var dateofdispatchArray = "";
    var trackingidarray = "";
    $.each($('.dateofdispatch'), function (i, a) {
        if ($(a).val() == "") {
            return false;
        }
        dateofdispatchArray += $(a).val() + ',';
    });
    $.each($('.consignmentno'), function (i, a) {
        if ($(a).val() != "") {
            if ($(a).val().length > 25) {
                alert("Consignment No. can't be greater than 25 digit.")
                return false;
            }
            var str = $(a).val();
            if (/^[a-zA-Z0-9-]*$/.test(str) == false) {
                alert('space is not allowed in consignment no.');
                invalid = false;
                return false;
            }
        }
        consignmentnoArray += $(a).val() + ',';
    });
    if (invalid == false) {
        return false;
    }
    $.each($('.dateofdelivery'), function (i, a) {
        if ($(a).val() == "") {
            return false;
        }
        dateofdeliveryArray += $(a).val() + ',';
    });
    //tracking Ids Array
    $.each($('.trackingidss'), function (i, a) {
        trackingidarray += $(a).val() + ',';
    });
    noticepostdate = dateofdispatchArray;
    consignmentnum = consignmentnoArray;
    dateofdelivery = dateofdeliveryArray;
    var Modesofdeleverypost = $("#Modesofdeleverypost option:selected").map(function () {
        return $(this).val();
    }).get().join(',');
    consignmentnum = consignmentnum.trim();
    var Cpnsignmentflag = false;
    var output = Modesofdeleverypost.split(',');
    $.each(output, function (index) {
        var finalOutput = output[index];
        if (finalOutput == "Post" || finalOutput == "Courier") {
            if (consignmentnum == "") {
                alert("Consignment number is required for Speed Post/Registered Post and  Courier.");
                Cpnsignmentflag = true;
            }
        }
    });
    if (Cpnsignmentflag == true) {
        return false;
    }
    if (noticepostdate == "") {
        alert("Enter Date of dispatch!")
        return false;
    }
    var formData = new FormData();
    formData.append("paramnoticepostdate", EncodeText(noticepostdate));
    formData.append("paramtrakingId", EncodeText(trackingidarray));
    formData.append("consignmentnum", EncodeText(consignmentnum));
    formData.append("paramnoticeid", EncodeText(noticeIdForPost));
    formData.append("Modeofdelevery", EncodeText(Modesofdeleverypost));
    formData.append("dateofdelivery", EncodeText(dateofdelivery));
    formData.append("rowcounterdata", EncodeText(Receiverrowcountdata));
    openload();
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/NoticePostDetail',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            closeload();
            if (response.Data.status) {
                alert("Status updated successfully.");
                $('#noticePostModal').modal('hide');
                $('#postdetailslayout')[0].reset();
                $("#Modesofdeleverypost").multiselect('reload');
                //callapi();
                location.reload(true);
                clearRecord();
            }
            else {
                $('#postdetailslayout')[0].reset();
                $("#Modesofdeleverypost").multiselect('reload');
                alert(response.Data.message);
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