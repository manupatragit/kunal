/**Compare document */
function CompareDocument() {
    var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
    if ($('#name').val() == "") {
        alert("Please enter name");
        return false;
    }
    var formData = new FormData();
    formData.append("filepath1", EncodeText($('#frmFileone').attr("src")));
    formData.append("filepath2", EncodeText($('#frmFiletwo').attr("src")));
    formData.append("name", EncodeText($('#name').val()));
    formData.append("day", EncodeText($('#days').val()));
    formData.append("firmid", EncodeText(userDetails.FirmId));
    formData.append("loginuserid", EncodeText(userDetails.Id));
    openload();
    $.ajax({
        async: true,
        url: "/Tools/CompareDocuments",
        type: 'POST',
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.Result != null) {
                if (data.Result == "firstfileblank") {
                    alert("Please upload first file");
                    $('#attachmentone').focus();
                    closeload();
                    return false;
                }
                else if (data.Result == "secondfileblank") {
                    alert("Please upload second file");
                    $('#attachmentone').focus();
                    closeload();
                    return false;
                }
                else if (data.Result == "0") {
                    alert("Compare document quota full.");
                    NewFileCompare();
                    closeload();
                    return false;
                }
                else {
                    $("#frm1").hide();
                    $("#frm2").hide();
                    $("#frm3").show();
                    $('#frmcompare').attr('src', data.Result.toString());
                    $('#frmFileone').attr('src', "");
                    $('#frmFiletwo').attr('src', "");
                }
                closeload();
            }
            else {
                $('#frm1').show();
                $('#frm2').show();
                $('#frm3').hide();
                closeload();
            }
        },
        error: function (data) {
            closeload();
        }
    });
}