var userDetails = JSON.parse(sessionStorage.getItem("LoginDetails"));
var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
$(document).ready(function () {
    GetDocList();
    if (userDetails.RoleId != "1") {
        $("#alldoc").css("display", "none")
        $("#txtalldoc").css("display", "none")
    }
})
function SaveDocument() {
    $("#myModalDocumnent").modal("show");
}
$(".doctype").click(function () {
    GetDocList();
})

/*Create files*/
$("#createfiles").click(function () {
    var formData = new FormData();
    var tempsize = 0;
    var tottempsize = 0;
    var totalFiles = document.getElementById("txtdoc").files.length;
    var description = $("#txtdescription").val();
    if (totalFiles == 0) {
        alert("Please select file.")
        return false;
    }
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById("txtdoc").files[i];
        var filename = file.name;
        if (filename.length > 35) {
            alert("File name should not be more than 35 character. Please check file name: " + filename);
            return false;
        }
        formData.append("FileUpload", file);
        try {
            if (typeof (file) != "undefined") {
                size = parseFloat(file.size / 1024).toFixed(2);
                tottempsize = parseFloat(tottempsize) + parseFloat(size);
                tempsize = parseFloat(size);
            }
        }
        catch (err) {
            //alert(err.message);
        }
        tempsize = tempsize.toFixed(2);
        var filesize = 20480
        if (tempsize > filesize) {
            new PNotify({
                title: 'Warning!',
                text: 'Maximum File size 5MB Allowed for each File',
                type: 'error',
                delay: 3000
            });
            return false
        }
    }
    formData.append("description", EncodeText(description));
    formData.append("FirmIdd", EncodeText(userDetails.FirmId));
    formData.append("LoginUserId", EncodeText(userDetails.Id));
    formData.append("hiddendocid", EncodeText($("#hiddendocid").val()));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/AddDocument",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            alert(data.message);
            $("#txtdescription").val("");
            $("#txtdoc").val("");
            $("#myModalDocumnent").modal("hide");
            GetDocList();
        },
        failure: function (data) {
            alert(data.message);
        },
        error: function (data) {
            alert(data.message);
        }
    });
})
$("#resercreatefiles").click(function () {
    $("#txtdescription").val("");
    $("#txtdoc").val("")
})

/*Get document list*/
function GetDocList() {
    openload();
    var html1 = '';
    var noticedoc = $('input[name=doctype]:checked').val();
    var formdata = new FormData();
    formdata.append("pageindex", EncodeText(pageindex));
    formdata.append("pagesize", EncodeText(pagesize));
    formdata.append("LoginId", EncodeText(userDetails.Id));
    formdata.append("RoleId", EncodeText(userDetails.RoleId));
    formdata.append("Doctype", EncodeText(noticedoc));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/Documentlisting",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            $("#binddocumnetlist").html("");
            $("#documnetlistfooter").html("");
            $("#nonodocumetlist").html("");
            if (response == "") {
                $("#nonodocumetlist").append("No document found.");
                closeload();
                return false;
            }
            else {
                if (noticedoc == "mydoc") {
                    $.each(response, function (i, a) {
                        if (a.MainDocId == null) {
                            if (a.CreatedById == userDetails.Id) {
                                if (i === 0) {
                                    firstvalue = a.rownum;
                                }
                                if (i === (response.length - 1)) {
                                    var pnext = pageindex;
                                    var pprev = pageindex;
                                    var pageno = pageindex;
                                    var totdata = a.totRow;
                                    var totpage = 0;
                                    if (a.totRow > 0) {
                                        pnext = parseInt(pnext) + 1;
                                        if (pnext == 0) pnext = 1;
                                        pprev = parseInt(pageno) - 1;
                                        if (pprev == 0) pprev = 1;
                                        totpage = parseInt(totdata) / parseInt(pagesize);
                                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                            totpage = parseInt(totpage) + 1;
                                        }
                                        $("#pagnumvalue").attr("max", totpage);
                                    }
                                    var tfot = '';
                                    tfot += '<ul style="margin-left: 30px;">'
                                    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                                    tfot += '<li><span>|</span></li>'
                                    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                    tfot += '<li><span>|</span></li>'
                                    tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                                    if (a.totRow <= response.length) {
                                    }
                                    else if (pageno == 1) {
                                    }
                                    else if (pageno == totpage) {
                                        tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                    }
                                    else {
                                        tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                    }
                                    if (pageno < totpage) {
                                        tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                                    }
                                    tfot += '</ul>'
                                    $("#documnetlistfooter").append(tfot);
                                }
                                var path = "/Documents/DocManagement/" + userDetails.FirmId + "/" + a.CreatedById + "/" + a.Name;
                                var name = a.Name
                                var strname = name.substr(4);
                                var encodename = encodeURIComponent(a.Name);
                                html1 += '<tr scope="row">';
                                html1 += '<td class="srnum">' + a.rownum + '</td>';
                                html1 += '<td class="docdate">' + dateFormat(new Date(a.CreatedDate)) + '</td>';
                                if (a.IsVersionAvailable) {
                                    html1 += '<td class="docfile">' + '<a href="' + path + '" download="' + strname + '">' + strname + '</a>' + `<div class="pull-right"><button type="button" 
                                      title="Click here to view document version"
                                      class="btn btn-sm" onclick=fnviewchilddoc('`+ a.Id + `')
                                      ><span class="caret">
                                      </button></div>`+ '</td>'
                                }
                                else {
                                    html1 += '<td class="docfile">' + '<a href="' + path + '" download="' + strname + '">' + strname + '</a>' + '</td>';
                                }
                                var ext = a.Name.split('.')[1];
                                html1 += '<td class="docfiletype">' + ext + '</td>';
                                html1 += '<td class="docdescription">' + a.Docdescription + '</td>';
                                html1 +=
                                    '<td class="doccreatedby">' + a.CreatedBy + ' ' + '<span>|</span> ' + '<span class="glyphicon glyphicon-share" Title="Share Document" onclick=fnShareDoc(`' + a.Id + '`) ></span ></td>';
                                if (!a.IsCheckout) {
                                    html1 += '<td class="docaction"><span class="glyphicon glyphicon-trash" Title="Delete Doc" onclick=fnDeleteDoc(`' + a.Id + '`)></span> | <span class="glyphicon glyphicon-edit" title="Edit doc description" onclick=fnEditDoc(`' + a.Id + '`)></span> | <a class="glyphicon glyphicon-download-alt" href="' + path + '" download="' + strname + '"></a> | <a href="' + path + '" download="' + strname + '" style="color:maroon" onclick=fncheckOut("' + a.Id + '")>Check Out</a> </td>';
                                } else {
                                    html1 += '<td class="docaction"><span class="glyphicon glyphicon-trash" Title="Delete Doc" onclick=fnDeleteDoc(`' + a.Id + '`)></span> | <span class="glyphicon glyphicon-edit" title="Edit doc description" onclick=fnEditDoc(`' + a.Id + '`)></span> | <a class="glyphicon glyphicon-download-alt" href="' + path + '" download="' + strname + '"></a> | <a href="#" onclick=fncheckin("' + a.Id + '","' + encodename + '")>CheckIn</a> </td>';
                                }
                                html1 += '<td>';
                                if (ext == "pdf") {
                                    if (a.IsDsigned) {
                                        html1 += '<a class="fa fa-file-pdf-o"  style="color:red;cursor:pointer;margin-left:10px" title="View dSign Copy" href="' + a.Dsigndocname + '" download></a> | ';
                                    }
                                    else {
                                        html1 += '<i class="fa fa-pencil" style="cursor:pointer;margin-left:10px" title="dSign" onclick=Goforsign("' + encodeURIComponent(a.Name) + '","2","' + a.Id + '")></i> | ';
                                    }
                                    if (a.IsEsigned) {
                                        html1 += '<a class="fa fa-file-pdf-o" aria-hidden="true" style="color:red;cursor:pointer;margin-left:10px" title="View eSign Copy" href="' + a.Esigndocname + '" download></a> | ';
                                    }
                                    else {
                                        html1 += '<i class="fa fa-pencil" style="cursor:pointer;margin-left:10px" title="eSign" onclick=Goforsign("' + encodeURIComponent(a.Name) + '","3","' + a.Id + '")></i> | ';
                                    }
                                    if (a.IsESignature) {
                                        html1 += '<a class="fa fa-file-pdf-o" aria-hidden="true" style="color:red;cursor:pointer;margin-left:10px" title="View eSignature Copy" href="' + a.ESignaturedocname + '" download></a> | ';
                                    }
                                    else {
                                        html1 += '<i class="fa fa-pencil" style="cursor:pointer;margin-left:10px" title="eSignature" onclick=Goforsign("' + encodeURIComponent(a.Name) + '","4","' + a.Id + '")></i> | ';
                                    }
                                }
                                else {
                                    html1 += '';
                                }
                                html1 += '</td>';
                                html1 += '</td></tr>';
                            }
                        }
                    });
                }
                else if (noticedoc == "sharedcoc") {
                    $.each(response, function (i, a) {
                        if (a.MainDocId == null) {
                            if (a.ReceiverId == userDetails.Id) {
                                if (i === 0) {
                                    firstvalue = a.rownum;
                                }
                                if (i === (response.length - 1)) {
                                    var pnext = pageindex;
                                    var pprev = pageindex;
                                    var pageno = pageindex;
                                    var totdata = a.totRow;
                                    var totpage = 0;
                                    if (a.totRow > 0) {
                                        pnext = parseInt(pnext) + 1;
                                        if (pnext == 0) pnext = 1;
                                        pprev = parseInt(pageno) - 1;
                                        if (pprev == 0) pprev = 1;
                                        totpage = parseInt(totdata) / parseInt(pagesize);
                                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                            totpage = parseInt(totpage) + 1;
                                        }
                                        $("#pagnumvalue").attr("max", totpage);
                                    }
                                    var tfot = '';
                                    tfot += '<ul style="margin-left: 30px;">'
                                    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                                    tfot += '<li><span>|</span></li>'
                                    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                    tfot += '<li><span>|</span></li>'
                                    tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                                    if (a.totRow <= response.length) {
                                    }
                                    else if (pageno == 1) {
                                    }
                                    else if (pageno == totpage) {
                                        tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                    }
                                    else {
                                        tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                    }
                                    if (pageno < totpage) {
                                        tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                                    }
                                    tfot += '</ul>'
                                    $("#documnetlistfooter").append(tfot);
                                }
                                var path = "/Documents/DocManagement/" + userDetails.FirmId + "/" + a.CreatedById + "/" + a.Name;
                                var name = a.Name
                                var strname = name.substr(4);
                                var encodename = encodeURIComponent(a.Name);
                                html1 += '<tr scope="row">';
                                html1 += '<td class="srnum">' + a.rownum + '</td>';
                                html1 += '<td class="docdate">' + dateFormat(new Date(a.CreatedDate)) + '</td>';
                                if (a.IsVersionAvailable) {
                                    html1 += '<td class="docfile">' + '<a href="' + path + '" download=' + strname + '>' + strname + '</a>' + `<div class="pull-right"><button type="button" 
                                      title="Click here to view document version"
                                      class="btn btn-sm" onclick=fnviewchilddoc('`+ a.Id + `')
                                      ><span class="caret">
                                      </button></div>`+ '</td>'
                                }
                                else {
                                    html1 += '<td class="docfile">' + '<a href="' + path + '" download=' + strname + '>' + strname + '</a>' + '</td>';
                                }
                                var ext = a.Name.split('.')[1];
                                html1 += '<td class="docfiletype">' + ext + '</td>';
                                html1 += '<td class="docdescription">' + a.Docdescription + '</td>';
                                html1 +=
                                    '<td class="doccreatedby">' + a.CreatedBy + ' ' + '<span>|</span> ' + '<span class="glyphicon glyphicon-share" Title="Share Document" onclick=fnShareDoc(`' + a.Id + '`) ></span ></td>';
                                if (!a.IsCheckout) {
                                    html1 += '<td class="docaction"><a class="glyphicon glyphicon-download-alt" href="' + path + '" download=' + strname + '></a> | <a href="' + path + '" download="' + strname + '" style="color:maroon" onclick=fncheckOut("' + a.Id + '")>Check Out</a> </td>';
                                } else {
                                    html1 += '<td class="docaction"><a class="glyphicon glyphicon-download-alt" href="' + path + '" download=' + strname + '></a> | <a href="#" onclick=fncheckin("' + a.Id + '","' + encodename + '")>CheckIn</a> </td>';
                                }
                                html1 += '<td>';
                                if (ext == "pdf") {
                                    if (a.IsDsigned) {
                                        html1 += '<a class="fa fa-file-pdf-o"  style="color:red;cursor:pointer;margin-left:10px" title="View dSign Copy" href="' + a.Dsigndocname + '" download></a> | ';
                                    }
                                    else {
                                        html1 += '<i class="fa fa-pencil" style="cursor:pointer;margin-left:10px" title="dSign" onclick=Goforsign("' + encodeURIComponent(a.Name) + '","2","' + a.Id + '")></i> | ';
                                    }
                                    if (a.IsEsigned) {
                                        html1 += '<a class="fa fa-file-pdf-o" aria-hidden="true" style="color:red;cursor:pointer;margin-left:10px" title="View eSign Copy" href="' + a.Esigndocname + '" download></a> | ';
                                    }
                                    else {
                                        html1 += '<i class="fa fa-pencil" style="cursor:pointer;margin-left:10px" title="eSign" onclick=Goforsign("' + encodeURIComponent(a.Name) + '","3","' + a.Id + '")></i> | ';
                                    }
                                    if (a.IsESignature) {
                                        html1 += '<a class="fa fa-file-pdf-o" aria-hidden="true" style="color:red;cursor:pointer;margin-left:10px" title="View eSignature Copy" href="' + a.ESignaturedocname + '" download></a> | ';
                                    }
                                    else {
                                        html1 += '<i class="fa fa-pencil" style="cursor:pointer;margin-left:10px" title="eSignature" onclick=Goforsign("' + encodeURIComponent(a.Name) + '","4","' + a.Id + '")></i> | ';
                                    }
                                }
                                else {
                                    html1 += '';
                                }
                                html1 += '</td>';
                                html1 += '</td></tr>';
                            }
                        }
                    });
                }
                if (noticedoc == "All") {
                    $.each(response, function (i, a) {
                        if (a.MainDocId == null) {
                            if (1 == 1) {
                                if (i === 0) {
                                    firstvalue = a.rownum;
                                }
                                if (i === (response.length - 1)) {
                                    var pnext = pageindex;
                                    var pprev = pageindex;
                                    var pageno = pageindex;
                                    var totdata = a.totRow;
                                    var totpage = 0;
                                    if (a.totRow > 0) {
                                        pnext = parseInt(pnext) + 1;
                                        if (pnext == 0) pnext = 1;
                                        pprev = parseInt(pageno) - 1;
                                        if (pprev == 0) pprev = 1;
                                        totpage = parseInt(totdata) / parseInt(pagesize);
                                        if (parseInt(totdata) % parseInt(pagesize) != 0) {
                                            totpage = parseInt(totpage) + 1;
                                        }
                                        $("#pagnumvalue").attr("max", totpage);
                                    }
                                    var tfot = '';
                                    tfot += '<ul style="margin-left: 30px;">'
                                    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                                    tfot += '<li><span>|</span></li>'
                                    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                    tfot += '<li><span>|</span></li>'
                                    tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                                    if (a.totRow <= response.length) {
                                    }
                                    else if (pageno == 1) {
                                    }
                                    else if (pageno == totpage) {
                                        tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                    }
                                    else {
                                        tfot += '<li><span><a id="ppaginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                                    }
                                    if (pageno < totpage) {
                                        tfot += '<a  id="ppaginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                                    }
                                    tfot += '</ul>'
                                    $("#documnetlistfooter").append(tfot);
                                }
                                var path = "/Documents/DocManagement/" + userDetails.FirmId + "/" + a.CreatedById + "/" + a.Name;
                                var name = a.Name
                                var strname = name.substr(4);
                                var encodename = encodeURIComponent(a.Name);
                                html1 += '<tr scope="row">';
                                html1 += '<td class="srnum">' + a.rownum + '</td>';
                                html1 += '<td class="docdate">' + dateFormat(new Date(a.CreatedDate)) + '</td>';
                                if (a.IsVersionAvailable) {
                                    html1 += '<td class="docfile">' + '<a href="' + path + '" download="' + strname + '">' + strname + '</a>' + `<div class="pull-right"><button type="button" 
                                      title="Click here to view document version"
                                      class="btn btn-sm" onclick=fnviewchilddoc('`+ a.Id + `')
                                      ><span class="caret">
                                      </button></div>`+ '</td>'
                                }
                                else {
                                    html1 += '<td class="docfile">' + '<a href="' + path + '" download="' + strname + '">' + strname + '</a>' + '</td>';
                                }
                                var ext = a.Name.split('.')[1];
                                html1 += '<td class="docfiletype">' + ext + '</td>';
                                html1 += '<td class="docdescription">' + a.Docdescription + '</td>';
                                html1 +=
                                    '<td class="doccreatedby">' + a.CreatedBy + ' ' + '<span>|</span> ' + '<span class="glyphicon glyphicon-share" Title="Share Document" onclick=fnShareDoc(`' + a.Id + '`) ></span ></td>';
                                if (!a.IsCheckout) {
                                    html1 += '<td class="docaction"><span class="glyphicon glyphicon-trash" Title="Delete Doc" onclick=fnDeleteDoc(`' + a.Id + '`)></span> | <span class="glyphicon glyphicon-edit" title="Edit doc description" onclick=fnEditDoc(`' + a.Id + '`)></span> | <a class="glyphicon glyphicon-download-alt" href="' + path + '" download="' + strname + '"></a> | <a href="' + path + '" download="' + strname + '" style="color:maroon" onclick=fncheckOut("' + a.Id + '") >Check Out</a> </td>';
                                } else {
                                    html1 += '<td class="docaction"><span class="glyphicon glyphicon-trash" Title="Delete Doc" onclick=fnDeleteDoc(`' + a.Id + '`)></span> | <span class="glyphicon glyphicon-edit" title="Edit doc description" onclick=fnEditDoc(`' + a.Id + '`)></span> | <a class="glyphicon glyphicon-download-alt" href="' + path + '" download="' + strname + '"></a> | <a href="#" onclick=fncheckin("' + a.Id + '","' + encodename + '")>CheckIn</a> </td>';
                                }
                                html1 += '<td>';
                                if (ext == "pdf") {
                                    if (a.IsDsigned) {
                                        html1 += '<a class="fa fa-file-pdf-o"  style="color:red;cursor:pointer;margin-left:10px" title="View dSign Copy" href="' + a.Dsigndocname + '" download></a> | ';
                                    }
                                    else {
                                        html1 += '<i class="fa fa-pencil" style="cursor:pointer;margin-left:10px" title="dSign" onclick=Goforsign("' + encodeURIComponent(a.Name) + '","2","' + a.Id + '")></i> | ';
                                    }
                                    if (a.IsEsigned) {
                                        html1 += '<a class="fa fa-file-pdf-o" aria-hidden="true" style="color:red;cursor:pointer;margin-left:10px" title="View eSign Copy" href="' + a.Esigndocname + '" download></a> | ';
                                    }
                                    else {
                                        html1 += '<i class="fa fa-pencil" style="cursor:pointer;margin-left:10px" title="eSign" onclick=Goforsign("' + encodeURIComponent(a.Name) + '","3","' + a.Id + '")></i> | ';
                                    }
                                    if (a.IsESignature) {
                                        html1 += '<a class="fa fa-file-pdf-o" aria-hidden="true" style="color:red;cursor:pointer;margin-left:10px" title="View eSignature Copy" href="' + a.ESignaturedocname + '" download></a> | ';
                                    }
                                    else {
                                        html1 += '<i class="fa fa-pencil" style="cursor:pointer;margin-left:10px" title="eSignature" onclick=Goforsign("' + encodeURIComponent(a.Name) + '","4","' + a.Id + '")></i> | ';
                                    }
                                }
                                else {
                                    html1 += '';
                                }
                                html1 += '</td>';
                                html1 += '</td></tr>';
                            }
                        }
                    });
                }
                $("#binddocumnetlist").append(html1);
                $("input:checkbox:not(:checked)").each(function () {
                    var column = "table ." + $(this).attr("name");
                    $(column).hide();
                });
            }
            closeload();
        },
        failure: function (response) {
            alert(data.responseText);
            closeload();
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
            closeload();
        } //End of AJAX error function
    });
}

/*Check out by id*/
function fncheckOut(id) {
    var formdata = new FormData();
    formdata.append("docid", EncodeText(id));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/UpdateCheckoutFlag",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            if (response) {
                GetDocList();
            }
        },
        failure: function (response) {
            alert(data.responseText);
            closeload();
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
            closeload();
        } //End of AJAX error function
    });
}
function changePage(page) {
    PageNumber = page;
    GetDocList();
}
$(document).on('click', '#ppaginate', function () {
    ppageindex = $(this).attr("index");
    pageindex = ppageindex;
    GetDocList();
});
$(document).on('change', '.chkdhide', function () {
    var column = "." + $(this).attr("name");
    $(column).toggle();
})
$(document).on('click', '#pgetdatabypagenum', function () {
    ppageindex = $("#ppagnumvalue").val();
    if (ppageindex != "undefined") {
        if (Math.sign(ppageindex) == 1) {
            var ppageindesx = $("#psotopage").text();
            if (ppageindex <= parseInt(ppageindesx)) {
                loadflag = true;
                changePage(ppageindex);
            }
            else {
                alert("Invalid page no.");
            }
        }
        else {
            alert("Invalid page no.");
        }
    }
});

/*View child doc*/
function fnviewchilddoc(id) {
    $("#documentversionviewmodal").modal('show');
    var html1 = "";
    var counter = 0;
    var formdata = new FormData();
    formdata.append("docid", EncodeText(id));
    $.ajax({
        type: "POST",
        url: "/api/NoticeNew/Docversionlist",
        dataType: 'json',
        contentType: false,
        processData: false,
        data: formdata,
        success: function (response) {
            $("#binddocumnetlistchild").html("");
            $("#nonodocumetlistchild").html("");
            if (response == "") {
                $("#nonodocumetlistchild").append("No document found.");
                closeload();
                return false;
            }
            else {
                $.each(response, function (i, a) {
                    counter = counter + 1;
                    var path = "/Documents/DocManagement/" + userDetails.FirmId + "/" + userDetails.Id + "/" + a.Name.split(":-")[0];
                    var time = a.CreatedDate.split('T')[1];
                    html1 += '<tr scope="row">';
                    html1 += '<td>' + counter + '</td>';
                    html1 += '<td>' + dateFormat(new Date(a.CreatedDate)) + '</td>' + '<td>' + time + '</td>';
                    var downloadname = a.Name.split(":-")[0]
                    html1 += '<td>' + a.CreatedBy + '</td>' + '<td><a href="' + path + '" download="' + downloadname.slice(4) + '">' + a.Name.slice(4) + '</a></td>';
                    html1 += '</td></tr>';
                });
                $("#binddocumnetlistchild").append(html1);
            }
            closeload();
        },
        failure: function (response) {
            alert(data.responseText);
            closeload();
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.responseText);
            closeload();
        } //End of AJAX error function
    });
}
var digfile = "";
var digsigntype = "";
var digdocid = "";
function Goforsign(file, signtype, docid) {
    $('#signmodalId').modal('show');
    digfile = decodeURIComponent(file);
    digsigntype = signtype;
    digdocid = docid;
}
$("#signpagebtn").click(function () {
    $('#signmodalId').modal('hide');
    var selectpageval = $("input[name='page']:checked").val();
    var signatory = $("#signeeName").val();
    var signpurpose = $("#signpurpose").val();
    if (selectpageval == "" || selectpageval == undefined) {
        alert("Please select page.")
        return false;
    }
    if (signatory == "" || signpurpose == "0") {
        alert("Alert ! mandatory fields can't be blank.")
        return false;
    }
    sessionStorage.setItem("digifilename", digfile);
    sessionStorage.setItem("signtype", digsigntype);
    sessionStorage.setItem("docid", digdocid);
    sessionStorage.setItem("docname", "PO");
    sessionStorage.setItem("username", userDetails.UserName);
    sessionStorage.setItem("selectpageval", selectpageval);
    sessionStorage.setItem("signee", signatory);
    sessionStorage.setItem("signpurpse", signpurpose);
    sessionStorage.setItem("userid", userDetails.Id);
    window.location.href = "/Document/GetSigncopy";
})
function dateFormat(d) {
    var month = d.toLocaleString('default', { month: 'long' })
    var monthname = month.substr(0, 3);
    return (d.getDate() + "").padStart(2, "0")
        + " " + monthname
        + " " + d.getFullYear();
}
/*Delete document by Id*/
function fnDeleteDoc(Id) {
    if (confirm("Are you sure you want to delete")) {
        var formData = new FormData();
        formData.append("DocId", EncodeText(Id));
        formData.append("CreatedByUserId", EncodeText(UserId));
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/NoticeNew/RemoveDocumentfromlisting",
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                alert(data.message);
                GetDocList(pageindex);
            }, //End of AJAX Success function
            failure: function (response) {
                alert(data.message);
            }, //End of AJAX failure function
            error: function (response) {
                alert(data.message);
            } //End of AJAX error function
        });
    }
}
function fnEditDoc(Id) {
    var formData = new FormData();
    formData.append("DocId", EncodeText(Id));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/NoticeNew/GetDocDescriptionbyId",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            $("#myModalDocumnentupdate").modal('show');
            $("#filenameid").html('<b>' + data.Name.substr(4) + '</b>');
            var description = data.Docdescription == null ? '' : data.Docdescription;
            $("#updatetxtdescription").val(description);
            $("#hiddendocidd").val(Id);
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.message);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.message);
        } //End of AJAX error function
    });
}

/*Update document*/
function fnUpdateDoc() {
    var formData = new FormData();
    formData.append("docId", EncodeText($("#hiddendocidd").val()));
    formData.append("description", EncodeText($("#updatetxtdescription").val()));
    formData.append("loginid", EncodeText(userDetails.Id));
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/NoticeNew/updateDocfromDocModule",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data) {
                $("#hiddendocidd").val("");
                $("#updatetxtdescription").val("");
                $("#myModalDocumnentupdate").modal('hide');
                GetDocList();
            }
        }, //End of AJAX Success function
        failure: function (response) {
            alert(data.message);
        }, //End of AJAX failure function
        error: function (response) {
            alert(data.message);
        } //End of AJAX error function
    });
}
function fnReset() {
    $("#hiddendocidd").val("");
    $("#updatetxtdescription").val("");
    $("#fileversionid").val("");
}
var versiondocid = "";
var filenameversion = "";
function fncheckin(docid, filename) {
    filename = decodeURIComponent(filename);
    versiondocid = docid;
    filenameversion = filename.substr(4);
    $("#myModalDocumnentdocversionupload").modal('show');
    $("#filenameversionid").html('<b>' + filename.substr(4) + '</b>');
}
/*Upload file version*/
function fnUploadversion() {
    var oldfilename = filenameversion.split('.')[0];
    var formData = new FormData();
    var totalFiles = document.getElementById("fileversionid").files.length;
    if (totalFiles == 0) {
        alert("Please select the file to be uploaded.");
        return false;
    }
    else {
        var filet = document.getElementById("fileversionid").files[0];
        var result = confirm("Are you sure to check-in this file?");
        if (result) {
            var tempsize = 0;
            var tottempsize = 0;
            for (var i = 0; i < totalFiles; i++) {
                var file = document.getElementById("fileversionid").files[i];
                var filename = file.name;
                var fileNameIndex = filename.lastIndexOf("/") + 1;
                var dotIndex = filename.lastIndexOf('.');
                var newfioename = filename.substr(fileNameIndex, dotIndex < fileNameIndex ? filename.length : dotIndex);
                var reg = /[@\\/:*?"<>|.&$%#!~+`'*^,]/;
                if (reg.test(newfioename) == true) {
                    alert('(@\/:*?"<>|.&$%#!~+`*^,) are not allowed.');
                    return false;
                }
                if (filename.length > 100) {
                    alert("The name of the file cannot exceed the limit of 100 characters. Please check file name: " + filename);
                    return false;
                }
                formData.append("FileUpload", file);
                try {
                    if (typeof (file) != "undefined") {
                        size = parseFloat(file.size / 1024).toFixed(2);
                        tottempsize = parseFloat(tottempsize) + parseFloat(size);
                        tempsize = parseFloat(size);
                    }
                }
                catch (err) {
                    //alert(err.message);
                }
                tempsize = tempsize.toFixed(2);
            }
            //if (oldfilename != newfioename) {
            if (!newfioename.startsWith(oldfilename)) {
                alert("File not uploaded for checkin. File name should start with the suffix:'" + oldfilename + "'");
                $("#fileversionid")[0].reset();
                closeload();
                return false;
            }
            openload();
            formData.append("description", EncodeText(""));
            formData.append("FirmIdd", EncodeText(userDetails.FirmId));
            formData.append("LoginUserId", EncodeText(userDetails.Id));
            formData.append("hiddendocid", EncodeText(versiondocid));
            $.ajax({
                type: "POST",
                url: "/api/NoticeNew/AddDocument",
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    alert(data.message);
                    $("#myModalDocumnentdocversionupload").modal("hide");
                    $("#fileversionid").val("");
                    closeload();
                    GetDocList();
                },
                failure: function (data) {
                    alert(data.message);
                },
                error: function (data) {
                    alert(data.message);
                }
            });
        }
    }
}
$(".assignto").change(function () {
    Getmanagerlist();
})
/*Get manager list*/
function Getmanagerlist() {
    $.ajax({
        type: "POST",
        url: "/api/Home/PartnerList",
        dataType: 'json',
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            $("#bindusr").html("");
            $("#bindusr").append($("<option></option>").val("0").text("Please Select"));
            var checkboxval = $("input[name='assignee']:checked").val();
            if (response != null) {
                $.each(response, function (key, value) {
                    if (checkboxval == "manager") {
                        if (value.RoleId == 2) {
                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                        }
                    }
                    else if (checkboxval == "client") {
                        if (value.RoleId == 3) {
                            $("#bindusr").append($("<option></option>").val(value.Id).text(value.UserName));
                        }
                    }
                })
            }
        },
        failure: function (response) {
        },
        error: function (response) {
        }
    });
}
var docshareid = "";
function fnShareDoc(id) {
    docshareid = id;
    $("#DocShareModal").modal('show');
}
$("#assignnoticebtn").click(function () {
    if (confirm("Are you sure you want to send this document?")) {
        var senderid = userDetails.Id;
        var receiverid = $("#bindusr").val();
        if (receiverid == "0" || receiverid == "" || receiverid == "undefind" || receiverid == "Please Select") {
            alert("Alert ! Please Select User.")
            return false
        }
        var firmid = userDetails.FirmId;
        var approvarType = "";
        var checkboxval = $("input[name='assignee']:checked").val();
        if (checkboxval == "manager") {
            approvarType = 2;
        }
        else if (checkboxval == "client") {
            approvarType = 3;
        }
        var formData = new FormData();
        formData.append("senderid", EncodeText(senderid));
        formData.append("receiverid", EncodeText(receiverid));
        formData.append("firmid", EncodeText(firmid));
        formData.append("docshareid", EncodeText(docshareid));
        $.ajax({
            type: "POST",
            url: "/api/NoticeNew/DocumentShare",
            data: formData,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result) {
                    alert("Document shared successfully.")
                }
                else {
                    alert("Something went wrong.")
                }
                $("#AssignModal").modal("hide");
                window.location.reload();
            }
        })
    }
})