var filename = sessionStorage.getItem("digifilename");
var signtype = sessionStorage.getItem("signtype");
var docid = sessionStorage.getItem("docid");
var userid = sessionStorage.getItem("userid");
var docname = sessionStorage.getItem("docname");
var username = sessionStorage.getItem("username");
var pageselect = sessionStorage.getItem("selectpageval");
var Filetype = sessionStorage.getItem("Filetype");
var Uid = sessionStorage.getItem("UID");
var Cordinatetype = sessionStorage.getItem("Cordinatetype");
/*Get signed cloud copy*/
$(document).ready(function () {
    var formdata = new FormData();
    formdata.append("filename", EncodeText(filename));
    formdata.append("signtype", EncodeText(signtype));
    formdata.append("docid", EncodeText(docid));
    formdata.append("userid", EncodeText(userid));
    formdata.append("docname", EncodeText(docname));
    formdata.append("username", EncodeText(username));
    formdata.append("pageselect", EncodeText(pageselect));
    formdata.append("Filetype", EncodeText(Filetype));
    formdata.append("Uid", EncodeText(Uid));
    formdata.append("Cordinatetype", EncodeText(Cordinatetype));
    $.ajax({
        type: "POST",
        url: "/api/AzureApi/SigncopyCloud",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            if (response.Data == 'FileSizeExceed') {
                var fcode = localStorage.getItem("FirmCode");
                alert("File Size can't be more than 10 MB");
                window.location = encodeURI("/" + fcode + "/azure/directorylist/0");
            }
            else {
                sessionStorage.removeItem("digifilename");
                sessionStorage.removeItem("signtype");
                $("#Parameter1").val(response.Data[2]);
                $("#Parameter2").val(response.Data[0]);
                $("#Parameter3").val(response.Data[1]);
                document.getElementById("frmdata").submit();
            }
        },
        failure: function (response) {
            alert(response);
        }, //End of AJAX failure function
        error: function (response) {
            alert(response.d);
        } //End of AJAX error function
    });
})