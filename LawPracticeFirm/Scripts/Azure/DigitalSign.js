var filename = filename;
var signtype = sessionStorage.getItem("signtype");
var docid = sessionStorage.getItem("docid");
var userid = fileuser;
var docname = sessionStorage.getItem("docname");
var username = fileuser;
var pageselect = sessionStorage.getItem("selectpageval")
/*Get Signup copy*/
$(document).ready(function () {
    var formdata = new FormData();
    formdata.append("filename", filename);
    formdata.append("signtype", signtype);
    formdata.append("docid", docid);
    formdata.append("userid", userid);
    formdata.append("docname", docname);
    formdata.append("username", username);
    formdata.append("pageselect", pageselect);
    $.ajax({
        type: "POST",
        url: "/api/AzureApi/Signcopy",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            sessionStorage.removeItem("digifilename");
            sessionStorage.removeItem("signtype");
            $("#Parameter1").val(response.Data[2]);
            $("#Parameter2").val(response.Data[0]);
            $("#Parameter3").val(response.Data[1]);
            document.getElementById("frmdata").submit();
        },
        failure: function (response) {
            alert(response);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.d);
        } //End of AJAX error function
    });
})