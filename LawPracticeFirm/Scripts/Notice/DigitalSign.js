var filename = sessionStorage.getItem("digifilename");
var signtype = sessionStorage.getItem("signtype");
var docid = sessionStorage.getItem("docid");
var userid = sessionStorage.getItem("userid");
var docname = sessionStorage.getItem("docname");
var username = sessionStorage.getItem("username");
var pageselect = sessionStorage.getItem("selectpageval");
var signatory = sessionStorage.getItem("signee");
var signfor = sessionStorage.getItem("signpurpse");
var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
$(document).ready(function () {
    var formdata = new FormData();
    formdata.append("filename", EncodeText(filename));
    formdata.append("signtype", EncodeText(signtype));
    formdata.append("docid", EncodeText(docid));
    formdata.append("userid", EncodeText(userid));
    formdata.append("docname", EncodeText(docname));
    formdata.append("username", EncodeText(username));
    formdata.append("pageselect", EncodeText(pageselect));
    formdata.append("signatory", EncodeText(signatory));
    formdata.append("signfor", EncodeText(signfor));
    formdata.append("loginuserid", EncodeText(userDetails.Id));
    formdata.append("firmid", EncodeText(userDetails.FirmId));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/GetSigncopy",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            sessionStorage.removeItem("digifilename");
            sessionStorage.removeItem("signtype");
            sessionStorage.removeItem("signee");
            sessionStorage.removeItem("signpurpse");
            $("#Parameter1").val(response[2]);
            $("#Parameter2").val(response[0]);
            $("#Parameter3").val(response[1]);
            document.getElementById("frmdata").submit();
        },
        failure: function (response) {
            alert(data.responseText);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
        } //End of AJAX error function
    });
})
