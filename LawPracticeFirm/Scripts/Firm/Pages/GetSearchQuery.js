var pageindex = 1, pagesize = 10, recordcount = 0, totrecord = 0;
var fcode = localStorage.getItem("FirmCode");
$(document).ready(function () {
    var fcode = localStorage.getItem("FirmCode");
    LoadSearchQueryData(pageindex);
    $(document).on('click', '#paginate', function () {
        pageindex = $(this).attr("index");
        LoadSearchQueryData(pageindex);
    });
});
/*Update status*/
function fn_statusUpdate(iid) {
    $("#divusergroupLabel").html("");
    var lblusergroup = '<h4 class="modal-title" id="myModalLabel">Update Active/InActive</h4>';
    $("#divusergroupLabel").html(lblusergroup);
    $("#modalNewgroup").modal();
    $('#enqId').val(iid);
}

/*Update status*/
function update() {
    var status = $('#statusId').val();
    var enqId = $('#enqId').val();
    var formData = new FormData();
    formData.append("status", status);
    formData.append("enqId", enqId);
    $.ajax({
        cache: false,
        async: true,
        type: "POST",
        url: "/api/ManupatraSearchApi/ChangeStatus",
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.Data == "Success") {
                alert("Status Changed Successfully");
                LoadSearchQueryData(pageindex);
            }
            else if (data.Data == "failed") {
                alert("Unable to change status, please delete or inactive the entries");
            }
        },
        error: function (data) {
        }
    });
}
/*Remove search query*/
function fn_Delete(contactId) {
    var formData = new FormData();
    formData.append("iid", contactId);
    var r = confirm("Are you sure You want to delete this query!");
    if (r == true) {
        $.ajax({
            async: true,
            type: "POST",
            url: "/api/ManupatraSearchApi/RemoveSearchQuery",
            //dataType: 'json',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.Data == "Success") {
                    alert("Successfully Deleted");
                    LoadSearchQueryData(pageindex);
                }
                else {
                    alert("Unable to delete.");
                }
            }
        });
    } else {
        return false;
    }
}

/*Get search query data*/
function LoadSearchQueryData(pageindex) {
    $("#tfooter").html("");
    var html3 = '';
    var formData = new FormData();
    formData.append("pagenum", pageindex);
    formData.append("pagesize", pagesize);
    openload();
    $.ajax({
        async: true,
        type: "POST",
        url: "/api/ManupatraSearchApi/ViewSearchQueryData",
        dataType: 'json',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response1) {
            if (response1.Data != "") {
                $("#dataescstatus").html("");
            }
            else {
                $("#dataescstatus").html("No result found !");
                closeload();
            }
            var length = response1.Data.length;
            $.each(response1.Data, function (i, a) {
                if (i === 0) {
                    firstvalue = a.rownum;
                }
                if (i === (length - 1)) {
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
                    tfot += '<ul>'
                    tfot += '<li>results <span>' + a.totRow + '</span>  <span id="sotopage" style="display:none">' + totpage + '</span></li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                    tfot += '<li><span>|</span></li>'
                    tfot += '<li ><input type="number" id="pagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="getdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                    if (a.totRow <= length) {
                    }
                    else if (pageno == 1) {
                    }
                    else if (pageno == totpage) {
                        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span></a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    }
                    else {
                        tfot += '<li><span><a id="paginate"  title="Previous Page" href="javascript:void()" index="' + pprev + '"><span class="glyphicon glyphicon-arrow-left" style="padding:0 !important"></span> </a></span>  ' + firstvalue + '-' + a.rownum + '  <span>'
                    }
                    if (pageno < totpage) {
                        tfot += '<a  id="paginate" title="Next Page" href="javascript:void()" index="' + pnext + '"  ><span class="glyphicon glyphicon-arrow-right" style="padding:0 0 0 10px !important"></span></a ></span ></li >'
                    }
                    $("#tfooter").append(tfot);
                }
                qty1 = qty1 + 1;
                var IId = a.iid;
                var SearchName = a.vSearchName;
                var vText = a.vText;
                var vAct = a.vAct;
                var vcitation = a.vcitation;
                var ddate = a.ddate;
                var IsActive = a.IsActive;
                var activename = "";
                if (IsActive == "1") {
                    activename = "Yes";
                }
                else {
                    activename = "No";
                }
                var update = '<a data-toggle="tab" href="#" id="edtNewgroup" onclick=fn_statusUpdate("' + IId + '")>update</a>';
                var deleteQuery = '<a data-toggle="tab" href="#" id="delNewgroup" onclick=fn_Delete("' + IId + '")>delete</a>';
                html3 += '<tr>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + qty1 + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" style="font-weight:bold;">' + SearchName + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + vAct + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + vText + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + ddate + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + activename + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + update + '</span>'
                html3 += '</td>'
                html3 += '<td>'
                html3 += '<span id="clname" >' + deleteQuery + '</span>'
                html3 += '</td>'
                html3 += '</tr>'
            });
            $("#bindCaseAlert").html("");
            $("#bindCaseAlert").append(html3);
            closeload();
        },
        failure: function (data) {
            alert(data.responseText);
            closeload();
        },
        error: function (data) {
            alert(data.responseText);
            closeload();
        }
    });
    $(document).on('click', '#addNewSearch', function () {
        var urls = "/" + fcode + "/ManupatraSearch/AddSearchQuery";
        url_redirect({
            url: urls,
            method: "post",
            data: {}
        });
    });
    function openload() {
        $("#myOverlay").css("display", "block");
    }
    function closeload() {
        $("#myOverlay").css("display", "none");
    }
}