var childtblclickcount = 0;
var ocreate, oedit, odelete = "";
localStorage.removeItem("Sent");
var NoticeParentId = "";
/*View reply for received notice*/
function ViewMoreItem(parentId) {
    if (childtblclickcount == 1) {
        $("#childtbltr").remove();
        childtblclickcount = 0;
    }
    else {

        
        childtblclickcount = 1;
        $(`<tr id="childtbltr"><td colspan="11"><div class="poptable">
        <div id="tblpoitem" class="poptable" data-example-id="hoverable-table">
        <h2>REPLY</h2>
        <table class="table-panel tblReplyReceived" id="table`+ parentId + `">
        <thead>
            <tr>
                           <th class="childtbltreplycls">No</th>
                            <th class="replyfrom" data-column="RespondentsName" data-order="desc">Sender's Name </th>
                            <th class="replyaddressedto" data-column="ReplyAddressedto" data-order="desc" title="Receiver's Name">Sent To</th>
                            <th class="noticedate" data-column="ReplytoNoticeCreatedOn" data-order="desc">Date of reply</th>
                            <th class="duedate" data-column="DueDateOfNotice" data-order="desc">Due Date</th>
                            <th class="remark" data-column="CreateReply" data-order="desc">Text </th>
                            <th class="modeofserviceordelivery" data-column="ModeofServiceorDelivery" data-order="desc">Mode</th>
                            <th class="replythrough" data-column="ReplyThrough" data-order="desc">Notice Through/To</th>
                            <th class="noticetitle" data-column="NoticeTitle" data-order="desc">Title </th>
                            <th class="noticesubject" data-column="ReplySubject" data-order="desc">Subject</th>
                            <th class="statutory" data-column="NoticeType" data-order="desc">Type </th>
                            <th class="tags" data-column="Tag" data-order="desc">Tags</th>
                            <th class="priority" data-column="Criticality" data-order="desc">Priority</th>
                            <th class="reasonforhighpriority" data-column="Resonforhighpriority" data-order="desc">Reason For High Priority</th>
                            <th class="claimamount" data-column="AmountClaimed" data-order="desc">Amount Claimed</th>
                            <th class="pending" data-column="CaseStatus" data-order="desc">Status</th>
                            <th class="addresseeaddress" data-column="AddresseeAddress" data-order="desc">Receiver's Address </th>
                            <th class="otherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc">Other Details of Receiver </th>
                            <th class="respondentsaddress" data-column="RespondentsAddress" data-order="desc">Sender's Address </th>
                            <th class="otherdetailsofrespondent" data-column="OtherDetailsofRespondent" data-order="desc">Other Details of Sender </th>
                            <th class="receivedattachment">Docs</th>
                            <th class="replytonoticeaction">Action</th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonoticechild"></tbody>
                        </table >
        <center> <div id="noreplytonoticechild"> </div></center>
</div>
         <div class="table-panel">
                    <div class="settingpanel">
                        <div class="col-md-6" id="footer-data">
                            <div style="float: left;padding: 0 10px 0 0;">
                                <ul style="list-style-type:none;">
                                    <li>
                                        <div class="btn-group dropup">
                                            <a href="javascript:void()" class="dropdown-toggle selctInputFormat" style="background-color: #ebebeb !important; margin-top: -5px !important;" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span class="glyphicon glyphicon-cog" style="font-size:14px;color:black;padding:0 5px 0 0 "></span>
                                                Customize Fields
                                            </a>
                                            <ul class="dropdown-menu settingshowhide" id="od" style="width:255px">
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="claimamount"><a href="#">Amount Claimed</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="noticedate" checked><a href="#">Date of Reply</a></li>
                              <li><input type="checkbox" class="shcheckbox1 chkdhide" name="receivedattachment" checked><a href="#">docs</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="duedate" checked><a href="#">Due Date</a></li>
                       <li><input type="checkbox" class="shcheckbox1 chkdhide" name="modeofserviceordelivery" checked><a href="#">Mode</a></li>
                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="pending"><a href="#">Notice Status</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="remark" checked><a href="#" class="dropdown-item">Notice Text</a></li>
                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="replythrough" checked><a href="#">Notice Through/To</a></li>
                             <li><input type="checkbox" class="shcheckbox1 chkdhide" name="otherdetailsofaddressee"><a href="#">Other Details of Receiver</a></li>
                              <li><input type="checkbox" class="shcheckbox1 chkdhide" name="otherdetailsofrespondent"><a href="#" class="dropdown-item">Other Details of Sender</a></li>
                                 <li><input type="checkbox" class="shcheckbox1 chkdhide" name="priority"><a href="#">Priority</a></li>
                                 <li><input type="checkbox" class="shcheckbox1 chkdhide" name="reasonforhighpriority"><a href="#">Reason For High Priority</a></li>
                                    <li><input type="checkbox" class="shcheckbox1 chkdhide" name="addresseeaddress"><a href="#">Receiver's Address</a></li>
                                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="respondentsaddress"><a href="#">Sender's Address</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="replyfrom" checked><a href="#">Sender's Name</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="replyaddressedto" checked><a href="#">Sent To</a></li>
                                             <li><input type="checkbox" class="shcheckbox1 chkdhide" name="noticesubject"><a href="#">Subject</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="tags"><a href="#">Tags</a></li>
                                               <li><input type="checkbox" class="shcheckbox1 chkdhide" name="noticetitle"><a href="#">Title</a></li>
                                                <li><input type="checkbox" class="shcheckbox1 chkdhide" name="statutory"><a href="#">Type</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="listingTableReplyFooterchild"></div>
                        </div>
                        <div class="col-md-6">
                                                    </div>
                </div>
</div>
       </div></td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
        NoticeParentId = parentId;
        var formData = new FormData();
        formData.append("SearchValue", EncodeText(""));
        formData.append("ColumName", EncodeText(ColumName));
        formData.append("SortedOrder", EncodeText(SortedOrder));
        formData.append("PageNumber", EncodeText(1));
        formData.append("PageSize", EncodeText(10));
        formData.append("parentId", EncodeText(parentId));
        var html = '';
        $.ajax({
            type: "POST",
            url: '/api/ReplyToNotice/ReplyToNoticeListByNoticeId',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response) {
                var response1 = JSON.parse(response.Data);
                response1 = response1.reverse();
                closeload();
                $("#tablevalueReplytonoticechild").html("");
                $("#listingTableReplyFooterchild").html("");
                $("#noreplytonoticechild").html("");
                if (response1 == "") {
                    $("#noreplytonoticechild").append("No Records found.");
                    return false;
                }
                else {
                    if (1 == 1) {
                        $.each(response1, function (i, a) {
                            if (i === 0) {
                                firstvalue = a.rownum;
                            }
                            if (i === (response.length - 1)) {
                                var pnext = pageindex;
                                var pprev = pageindex;
                                var pageno = pageindex;
                                var totdata = a.TotalRows;
                                var totpage = 0;
                                if (a.TotalRows > 0) {
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
                                tfot += '<li>results <span>' + a.TotalRows + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  class="footerInput"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer" class="gobtn">Go</button> </li>'
                                if (a.TotalRows <= response.length) {
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
                                $("#listingTableReplyFooterchild").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateReply;
                            html += "<tr class=" + a.NoticeID + ">";
                            if (a.IsReplyReceivedCount > 0) {
                                html += "<td>" + a.RowId + "<span class='glyphicon glyphicon-chevron-down' title='View more item' style='cursor: pointer;position:relative;left:5px' onclick=ViewMoreItem2('" + a.NoticeID + "')></span></td>";
                            }
                            else {
                                html += "<td>" + a.RowId + "</td>";
                            }
                            html += "<td  class='replyfrom'>" + a.SendersName + "</td>";
                            html += "<td class='replyaddressedto'>" + a.ReplyAddressedto + "</td>";
                            html += "<td class='noticedate'>" + (a.ReplytoNoticeCreatedOn == null || a.ReplytoNoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ReplytoNoticeCreatedOn))) + "</td>";
                            if (a.DueDateOfNotice == "1900-01-01T00:00:00" || a.DueDateOfNotice == null) {
                                html += "<td class='duedate'></td>";
                            }
                            else {
                                html += "<td class='duedate'>" + (a.DueDateOfNotice == null ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>";
                            }
                            if (a.CreateReply.length > 0) {
                                html += "<td  class='remark'>" + span.innerText.substring(0, 0) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","ReplyNotice") title="View more"><img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                            }
                            else {
                                html += "<td  class='remark'>" + span.innerText + "</td>";
                            }
                            html += "<td  class='modeofserviceordelivery'>" + (a.ModeofServiceorDelivery == "null" ? '' : a.ModeofServiceorDelivery) + "</td>";
                            html += "<td  class='replythrough'>" + (a.NoticeThrough == "null" ? '' : a.NoticeThrough) + "</td>";
                            html += "<td class='noticetitle'>" + a.NoticeTitle + "</td>";
                            var RSubject = "";
                            if (a.ReplySubject == "'") {
                                RSubject = " ";
                            }
                            else {
                                RSubject = a.ReplySubject;
                            }
                            html += "<td class='noticesubject'>" + RSubject + "</td>";
                            html += "<td class='statutory'>" + a.NoticeType + "</td>";
                            html += "<td  class='tags'>" + a.Tag + "</td>";
                            if (a.Criticality == null || a.Criticality == "0") {
                                html += "<td class='priority'></td>";
                            }
                            else {
                                html += "<td class='priority'>" + a.Criticality + "</td>";
                            }
                            if (a.Resonforhighpriority == null) {
                                html += "<td class='reasonforhighpriority'></td>";
                            }
                            else {
                                html += "<td class='reasonforhighpriority'>" + a.Resonforhighpriority + "</td>";
                            }
                            if (a.AmountClaimed == "0" || a.AmountClaimed == null) {
                                html += "<td class='claimamount'></td>";
                            }
                            else {
                                html += "<td class='claimamount'>" + a.AmountClaimed + "</td>";
                            }
                            html += "<td class='pending'>" + a.CaseStatus + "</td>";
                            html += "<td class='addresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='otherdetailsofaddressee'>" + a.OtherDetailsofRespondent + "</td>";
                            html += "<td class='respondentsaddress'>" + a.RespondentsAddress + "</td>";
                            html += "<td class='otherdetailsofrespondent'>" + a.OtherDetailsofAddressee + "</td>";
                            html += '<td class="receivedattachment"><i title="View notice draft" aria-hidden="true" id="incomingnoticerelevantdoc1" onclick=ViewNoticeDraft("' + a.NoticeID + '") id-val="' + a.NoticeID + '" ><img src="/newassets/img/folder-icon.png"></i></td>';
                            html += '<td class="replytonoticeaction"><a style="cursor:pointer;"  onclick=EditNoticeReply("' + a.NoticeID + '") title="Edit Notice"><img src="/newassets/img/edit-icon.png"></a> <a style="cursor:pointer;" onclick=AddRejoinder("' + a.NoticeID + '","' + parentId + '") title = "Create Rejoinder" ><img src="/newassets/img/viewmore-icon.png"></a> <a style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title = "Delete" ><img src="/newassets/img/deletecasesingle-icon.png"></a> </td>';
                            html += "<tr>";
                        });
                        $("#tablevalueReplytonoticechild").append(html);
                        $("input:checkbox:not(:checked)").each(function () {
                            var column = "table ." + $(this).attr("name");
                            $(column).hide();
                        });
                    }
                }
            },
            error: function (xhr) {
                alert('error');
            }
        })
    }
}
$(document).on("click", "#incomingnoticerelevantdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=ReplyToNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
function comparator(a, b) {
    if (a.dataset.subject < b.dataset.subject)
        return -1;
    if (a.dataset.subject > b.dataset.subject)
        return 1;
    return 0;
}
// Function to sort Data
function SortData() {
    var subjects =
        document.querySelectorAll("[data-subject]");
    var subjectsArray = Array.from(subjects);
    let sorted = subjectsArray.sort(comparator);
    sorted.forEach(e =>
        document.querySelector("#od1").
            appendChild(e));
}
/*Search new post details*/
function SearchPostDetailsnew(Noticeidss) {
    $("#ViewMultiplePostdetils").modal('show');
    $("#Trackingnumberlist").html('');
    var formData = new FormData();
    formData.append("paramNoticeId", EncodeText(Noticeidss));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/ViewSpeedPostDetailByNoticeId',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            $("#Trackingnumberlist").append($("<option></option>").val("").text('Please Select'));
            if (response != null) {
                $.each(response.Data, function (key, value) {
                    $("#Trackingnumberlist").append($("<option></option>").val(value.TrackingId).text(value.consignementnum));
                })
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
$(document).on('click', '#btnsearchconsignment', function () {
    var trackingId = $("#Trackingnumberlist option:selected").val();
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
            console.log(response, "postdetail")
            window.open(response.vImagepath, '_blank');
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
});

/*View more reply notice*/
function fnViewmorereplytonotice(mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/RejoinderNotice/RejoinderReceived"
    sessionStorage.setItem("mainnoticeid", mainnoticeid);
}
$(document).on("click", "#noticerejoinderdoc", function () {
    var fileid = $(this).attr("id-val");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=RejoinderNotice&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});

/*View relevant notice*/
$(document).on("click", "#noticerelevantdoc1", function () {
    var fileid = $(this).attr("id-val");
    var filetype = $(this).attr("id-type");
    var mode = "view";
    var url = "/Firm/Noticemultiplefilelist/?ftype=" + filetype + "&data=" + fileid + "&mode=" + mode;
    $('.mymodels').load(url, function (result) {
        $('#myDocumentModal').modal({ show: true });
    });
});
/*Add rejoinder for received nottice*/
function AddRejoinder(noticeid, mainnoticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.localStorage.setItem("NType", "CreateReceived");
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice?Id=" + noticeid + "&Main=" + mainnoticeid + "&InitiatedBy=opponent"
}
var childtblrejoinderclickcount = 0;
/*View rejoinder for received notice*/
function ViewMoreItem2(parentId) {
    if (childtblrejoinderclickcount == 1) {
        $("#childrejoindertbltr").remove();
        childtblrejoinderclickcount = 0;
    }
    else {
        childtblrejoinderclickcount = 1;
        $(`<tr id="childrejoindertbltr"><td colspan="11"><div id="tblrejoinderitem"  data-example-id="hoverable-table">
<h2>REJOINDER</h2>
        <table class= "table-panel tblrejoinderclass" id="table`+ parentId + `">
        <thead>
            <tr>
                        <th class="childrejoinderSN" data-column="RejoinderSN" data-order="desc"><div>No</div></th>
                        <th class="childrejoinderaddressedto" data-column="RejoinderAddressedto" data-order="desc" title="Sender's Name"><div>Received From</div></th>
                        <th class="childnoticesender" data-column="SendersName" data-order="desc" title="Receiver's Name"><div>Sent To</div></th>
                        <th class="childdateofrejoinder" data-column="DateofRejoinder" data-order="desc"><div>Date of Rejoinder</div></th>
                        <th class="childdateofreceipt" data-column="DateofReceipt" data-order="desc"><div>Received on Date</div></th>
                        <th class="childnoticeduedate" data-column="DueDateOfNotice" data-order="desc"><div>Due Date</div></th>
                        <th class="childnoticetitle" data-column="NoticeTitle" data-order="desc"><div>Title</div></th>
                        <th class="childnoticesubject" data-column="RejoinderSubject" data-order="desc"><div>Subject</div></th>
                       <th width="100px;" class="childmodeofdeliveryofrejoinder" data-column="ModeofDeliveryofRejoinder" data-order="desc"><div>Mode</div></th>
                        <th class="childremark" data-column="CreateRejoinder" data-order="desc"><div>Text </div></th>
                        <th class="childpending" data-column="CaseStatus" data-order="desc"><div>Status</div></th>
                        <th class="childstatutory" data-column="NoticeType" data-order="desc"><div>Type</div></th>                        
                        <th class="childdispatched" data-column="DateofDelivery" data-order="desc"><div>Date of Delivery</div></th>                        
                        <th class="childaddresseeaddress" data-column="AddresseeAddress" data-order="desc"><div>Receiver's Address</div></th>
                        <th class="childotherdetailsofaddressee" data-column="OtherDetailsofAddressee" data-order="desc"><div>Other Details of Receiver</div></th>
                        <th class="childrejoinderthrough" data-column="RejoinderThrough" data-order="desc"><div>Notice Through/To</div></th>
                        <th class="childcriticality" data-column="Criticality" data-order="desc"><div>Priority</div></th>
                        <th class="childreasonforhighpriority" data-column="Resonforhighpriority" data-order="desc"><div>Reason For High Priority</div></th>
                        <th class="childtag" data-column="Tag" data-order="desc"><div>Tags</div></th>
                        <th class="childclaimamount" data-column="AmountClaimed" data-order="desc"><div>Amount Claimed</div></th>
<th class="childattachment" data-column="childattachment" data-order="desc"><div>docs</div></th>
                        <th class="receivedreplyaction childtbltsssr1cls" >Action</th>
            </tr>
        </thead>
        <tbody id="tablevalueReplytonotice"></tbody>
                        </table >
        <center> <div id="noreplytonotice"> </div></center>
       </div>
<div class="table-panel" style="margin: 6px 0 0 24px;">
                    <div class="row settingpanel">
                        <div class="col-md-6" id="footer-data">
                            <div style="float: left;padding: 0 10px 0 0;">
                                <ul>
                                    <li>
                                        <div class="btn-group dropup">
                                            <a href="javascript:void()" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span class="glyphicon glyphicon-cog" style="font-size:14px;color:black;padding:0 5px 0 0 "></span>
                                                Customize Fields <span class="glyphicon glyphicon-chevron-down"></span>
                                            </a>
                                            <ul class="dropdown-menu settingshowhide" id="od" style="width:260px">
                                     <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childclaimamount"><a href="#">Amount Claimed</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdispatched"><a href="#">Date of Delivery </a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofrejoinder" checked><a href="#">Date of Rejoinder</a></li>
                                    <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childattachment" checked><a href="#">docs</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticeduedate" checked><a href="#">Due Date</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childmodeofdeliveryofrejoinder" checked><a href="#">Mode of Delivery</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childpending"><a href="#">Notice Status</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childremark" checked><a href="#">Notice Text</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderthrough"><a href="#">Notice Through/To</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childotherdetailsofaddressee"><a href="#">Other Details of Receiver</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childcriticality"><a href="#">Priority</a></li>
                                     <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childrejoinderaddressedto" checked><a href="#" class="dropdown-item">Received From</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childreasonforhighpriority"><a href="#">Reason For High Priority</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childaddresseeaddress"><a href="#">Receiver's Address</a></li>
                                      <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childdateofreceipt" checked><a href="#">Received On Date</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesender" checked><a href="#">Sent To</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticesubject"><a href="#">Subject</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childtag"><a href="#">Tags</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childnoticetitle" ><a href="#">Title</a></li>
                                            <li><input type="checkbox" class="shcheckbox1 chkdhide" name="childstatutory"><a href="#">Type</a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div id="listingTableReplyFooter" style="display:none;"></div>
                        </div>
                        <div class="col-md-6" style="padding-right:20px">
                                                    </div>
                    </div>
                </div>
</td></tr>`).insertAfter($("#example").find('tr.' + parentId + ''));
        var formData = new FormData();
        formData.append("SearchValue", EncodeText(""));
        formData.append("ColumName", EncodeText(ColumName));
        formData.append("SortedOrder", EncodeText(SortedOrder));
        formData.append("PageNumber", EncodeText(1));
        formData.append("PageSize", EncodeText(10));
        formData.append("parentId", EncodeText(parentId));
        var html = '';
        $.ajax({
            type: "POST",
            url: '/api/RejoinderNotice/RejoinderNoticeListbyNoticeId',
            contentType: false,
            processData: false,
            data: formData,
            success: function (response1) {
                var response = JSON.parse(response1.Data);
                response = response.reverse();
                closeload();
                $("#tablevalueReplytonotice").html("");
                $("#listingTableReplyFooter").html("");
                $("#noreplytonotice").html("");
                if (response == "") {
                    $("#noreplytonotice").append("No Records found.");
                    return false;
                }
                else {
                    if (1 == 1) {
                        $.each(response, function (i, a) {
                            oedit = a.oedit;
                            odelete = a.odelete;
                            ocreate = a.ocreate;
                            return false;
                        });
                        $.each(response, function (i, a) {
                            if (i === 0) {
                                firstvalue = a.rownum;
                            }
                            if (i === (response.length - 1)) {
                                var pnext = pageindex;
                                var pprev = pageindex;
                                var pageno = pageindex;
                                var totdata = a.TotalRows;
                                var totpage = 0;
                                if (a.TotalRows > 0) {
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
                                tfot += '<li>results <span>' + a.TotalRows + '</span>  <span id="psotopage" style="display:none">' + totpage + '</span></li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += '<li>pages ' + pageindex + '/ ' + parseInt(totpage) + '</li>'
                                tfot += '<li><span>|</span></li>'
                                tfot += '<li ><input type="number" id="ppagnumvalue" min="1"  style="border-bottom:1px solid #4b4b4b!important;width:30px;margin:0 8px 0 0 !Important"><a type="button" id="pgetdatabypagenum" style="margin-left:10px;cursor:pointer">Go</button> </li>'
                                if (a.TotalRows <= response.length) {
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
                                $("#listingTableReplyFooter").append(tfot);
                            }
                            var span = document.createElement('span');
                            span.innerHTML = a.CreateRejoinder;
                            html += "<tr>";
                            html += "<td class='childrejoinderSN'>" + a.RowId + "</td>";
                            html += "<td class='childrejoinderaddressedto'>" + a.RejoinderAddressedto + "</td>";
                            html += "<td class='childnoticesender'>" + a.SendersName + "</td>";
                            html += "<td class='childdateofrejoinder'>" + (a.DateofCreatingRejoinder == null ? ' ' : dateFormat(new Date(a.DateofCreatingRejoinder))) + "</td>";
                            html += "<td class='childdateofrejoinder'>" + (a.DateofReceipt == null || a.DateofReceipt == '1900-01-01T00:00:00' ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>";
                            html += "<td class='childnoticeduedate'>" + (a.DueDateOfNotice == null || a.DueDateOfNotice == '1900-01-01T00:00:00' ? ' ' : dateFormat(new Date(a.DueDateOfNotice))) + "</td>"; //for due date of notice in Received Rejoinder Table
                            html += "<td class='childnoticetitle'>" + a.NoticeTitle + "</td>";
                            html += "<td class='childnoticesubject'>" + (a.RejoinderSubject == "'" ? "" : a.RejoinderSubject) + "</td>";
                            html += "<td class='childmodeofdeliveryofrejoinder'>" + (a.ModeofDeliveryofRejoinder == "null" ? '' : a.ModeofDeliveryofRejoinder) + "</td>";
                            if (a.CreateRejoinder.length > 60) {
                                html += "<td  class='childremark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Rejoinder") title="View more"><img src="/newassets/img/view-icon.png" /></a>' + "</td>";
                            }
                            else {
                                html += "<td  class='childremark'>" + span.innerText + "</td>";
                            }
                            html += "<td class='childpending'>" + a.CaseStatus + "</td>";
                            html += "<td class='childstatutory'>" + a.NoticeType + "</td>";
                            html += "<td class='childdispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == '1900-01-01T00:00:00' ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>";
                            html += "<td  class='childaddresseeaddress'>" + a.AddresseeAddress + "</td>";
                            html += "<td class='childotherdetailsofaddressee'>" + a.OtherDetailsofAddressee + "</td>";
                            html += "<td class='childrejoinderthrough'>" + (a.RejoinderThrough == 'Please Select' ? '' : a.RejoinderThrough) + "</td>";
                            html += "<td class='childcriticality'>" + a.Criticality + "</td>";
                            html += "<td class='childreasonforhighpriority'>" + a.Resonforhighpriority + "</td>";
                            html += "<td class='childtag'>" + a.Tag + "</td>";
                            if (a.AmountClaimed == null || a.AmountClaimed == "0") {
                                html += "<td class='childclaimamount'></td>";
                            }
                            else {
                                html += "<td class='childclaimamount'>" + a.AmountClaimed + "</td>";
                            }
                            html += '<td class="childattachment"><i title="View notice draft" aria-hidden="true"  id="noticerelevantdoc11-" style="cursor:pointer;" onclick=ViewNoticeDraft("' + a.NoticeID + '") id-val="' + a.NoticeID + '" id-type="RejoinderNotice"><img src="/newassets/img/folder-icon.png"></i></td>'
                            if (a.TrackingId != "") {
                                html += '<td class="replytonoticeaction"><a style="cursor:pointer;"  onclick=RejoinderEditNotice("' + a.NoticeID + '") title="Edit Notice"><img src="/newassets/img/edit-icon.png"></a><a style="cursor:pointer;" onclick=AddCreateReplycommon("' + NoticeParentId + '") title = "Add Details : Reply To Notice Received" ><img src="/newassets/img/viewmore-icon.png"></a><a style="cursor:pointer;" onclick=fnfillNoticePostDetails("' + a.NoticeID + '","' + a.TrackingId + '","' + a.ConsignmentNum + '","' + a.ConsignDate + '") title = "Save Dispatch Details" ><img src="/newassets/img/save-icon.png"></a><a style="cursor: pointer;" onclick=SearchPostDetailsnew("' + a.NoticeID + '") title = "Speed Post Tracking" ><img src="/newassets/img/speedpost-icon.png"></a><a style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title = "Delete" ><img src="/newassets/img/deletecasesingle-icon.png"></a></td>';
                            }
                            else {
                                html += '<td class="replytonoticeaction"><a style="cursor:pointer;"  onclick=RejoinderEditNotice("' + a.NoticeID + '") title="Edit Notice"><img src="/newassets/img/edit-icon.png"></a><a style="cursor:pointer;" onclick=AddCreateReplycommon("' + NoticeParentId + '") title = "Add Details : Reply To Notice Received" ><img src="/newassets/img/viewmore-icon.png"></a><a style="cursor:pointer;" onclick=fnfillNoticePostDetails("' + a.NoticeID + '","' + a.TrackingId + '","' + a.ConsignmentNum + '","' + a.ConsignDate + '") title = "Save Dispatch Details" ><img src="/newassets/img/save-icon.png"></a><a style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title = "Delete" ><img src="/newassets/img/deletecasesingle-icon.png"></a> </td>';
                            }
                            html += "<tr>";
                        });
                        $("#tablevalueReplytonotice").append(html);
                        $("input:checkbox:not(:checked)").each(function () {
                            var column = "table ." + $(this).attr("name");
                            $(column).hide();
                        });
                    }
                }
            },
            error: function (xhr) {
                alert('error');
            }
        })
    }
}
$('dropdown-toggle').on('click', function (event) {
    $(this).parent().toggleClass('open');
});
/*Create new reply notice for received notice*/
function AddCreateReplycommon(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.location.href = "/" + firmcode + "/ReplyToNotice/AddReplyToNotice?Id=" + noticeid;
    sessionStorage.removeItem("ReplyNoticeId");
}
/*Rejoinder edit notice*/
function RejoinderEditNotice(noticeid) {
    var firmcode = localStorage.getItem("FirmCode");
    window.localStorage.setItem("NType", "UpdateReceived")
    window.location.href = "/" + firmcode + "/RejoinderNotice/AddRejoinderNotice"
    sessionStorage.setItem("RejoinderNoticeId", noticeid)
}
/*View draft notice*/
function ViewNoticeDraft(noticeid) {
    $("#NoticeDraftModal").modal('show');
    $("#Prime").show();
    $("#Second").hide();
    $("#primeSectionData").show();
    $("#SecondDataSection").hide();

    $("#draftnoticemodlbody").html('');
    $("#receiverEmailidd").html('');
    $("#receiverEmailiddother").val('');
    $("#receiverEmailidddiv").hide();
    $("#spanEmailId").hide();
    $("#noticemailaudit").html('');
    $("#nonoticemailaudit").html('');
    var html = '';
    var html1 = '';
    var formData = new FormData();
    formData.append("NoticeId", EncodeText(noticeid));
    $.ajax({
        type: "POST",
        url: '/api/NoticeNew/DraftList',
        contentType: false,
        processData: false,
        data: formData,
        success: function (response) {
            if (response.Data[0].length > 0) {
                var len = response.Data[0].length;
                $.each(response.Data[0], function (key, data) {
                    $('#lbltitle').val(data.NoticeTitle);
                    var path = "/DownloadFile.ashx?ftoken=" + data.Id + "&module=DraftNotice";
                    html += `<tr>
                        <td><input type='checkbox' name='checkAll' class='checkboxcls' value='`+ data.Filename + `' data-val='` + noticeid + `'> </td>
                       
                        <td>`+ dateFormat(new Date(data.CreatedDate)) + `</td>
                        <td> <span>Version - ` + len + `</span></td>
                        <td>`+ data.CreatedByName + `</td>
                         <td> <a href=` + path + ` download="Version - ` + len + `"><img src="/newassets/img/download-icon.png" /></a></td>
                        <tr/>`
                    len = (len - 1);
                })
                $("#draftnoticemodlbody").html(html);
            }
            else {
                $("#nodraftnotice").append("No records found.");
            }
            if (response.Data[1].length > 0) {
                $.each(response.Data[1], function (key, data) {
                    html1 += `<tr>
                        <td>`+ data.DisplayFileName + `</td>
                        <td>`+ data.SentFromMailId + `</td>
                        <td>`+ data.SentToMailId + `</td>
                         <td>`+ data.MailStatusMessage.replace('On', '') + `</td>
                        <td>`+ dateFormat(new Date(data.MailSentTime)) + `</td>
                        <tr/>`
                    len = (len - 1);
                })
                $("#noticemailaudit").html(html1);
            }
            else {
                $("#nonoticemailaudit").append("No records found.");
            }
            if (response.Data[2].length > 0) {
                $("#receiverEmailidd").html("");
                $("#receiverEmailidd").append($("<option></option>").val("").text('Select email'));
                $("#receiverEmailidd").append($("<option></option>").val("Other").text('Others'));
                $.each(response.Data[2], function (key, data) {
                    $("#receiverEmailidd").append($("<option data-id=" + data.Id + "></option>").val(data.ReceiverEmails).text(data.ReceiverEmails));
                })
            }
            else {
                $("#receiverEmailidd").append($("<option></option>").val("").text('Select email'));
                $("#receiverEmailidd").append($("<option></option>").val("Other").text('Others'));
            }
        },
        error: function (response) {
            alert("Something went wrong.")
        }
    })
}
//function ViewNoticeDraft(noticeid) {
//    $("#NoticeDraftModal").modal('show');
//    $("#draftnoticemodlbody").html('');
//    $("#receiverEmailidd").val("");
//    $("#spanEmailId").hide();
//    $("#noticemailaudit").html('');
//    $("#nonoticemailaudit").html('');
//    var html = '';
//    var html1 = '';
//    var formData = new FormData();
//    formData.append("NoticeId", EncodeText(noticeid));
//    $.ajax({
//        type: "POST",
//        url: '/api/NoticeNew/DraftList',
//        contentType: false,
//        processData: false,
//        data: formData,
//        success: function (response) {
//            if (response.Data[0].length > 0) {
//                var len = response.Data[0].length;
//                $.each(response.Data[0], function (key, data) {
//                    $('#lbltitle').val(data.NoticeTitle);
//                    var path = "/DownloadFile.ashx?ftoken=" + data.Id + "&module=DraftNotice";
//                    html += `<tr>
//                        <td>`+ data.SrNum + `</td>
//                        <td>`+ dateFormat(new Date(data.CreatedDate)) + `</td>
//                        <td><input type='checkbox' name='checkAll' class='checkboxcls' value='`+ data.Filename + `' data-val='` + noticeid + `' data-name='Draft Version - ` + len + `'> | <a  href=` + path + ` download="Version - ` + len + `">Version - ` + len + `</a></td>
//                        <td>`+ data.CreatedByName + `</td>
//                        <tr/>`
//                    len = (len - 1);
//                })
//                $("#draftnoticemodlbody").html(html);
//            }
//            else {
//                $("#nodraftnotice").append("No records found.");
//            }
//            if (response.Data[1].length > 0) {
//                $.each(response.Data[1], function (key, data) {
//                    html1 += `<tr>
//                        <td>`+ data.DisplayFileName + `</td>
//                        <td>`+ data.SentFromMailId + `</td>
//                        <td>`+ data.SentToMailId + `</td>
//                         <td>`+ data.MailStatusMessage.replace('On', '') + `</td>
//                        <td>`+ dateFormat(new Date(data.MailSentTime)) + `</td>
//                        <tr/>`
//                    len = (len - 1);
//                })
//                $("#noticemailaudit").html(html1);
//            }
//            else {
//                $("#nonoticemailaudit").append("No records found.");
//            }
//        },
//        error: function (response) {
//            alert("Something went wrong.")
//        }
//    })
//}

$(document).on('change', '#receiverEmailidd', function () {
    var textvalues = $(this).val();
    if (textvalues == "Other") {
        $("#receiverEmailiddother").val('');
        $("#receiverEmailidddiv").show();
    }
    else {
        $("#receiverEmailidddiv").hide();
    }
});
$(document).on('click', '#listVersionData', function () {
    $("#Prime").show();
    $("#Second").hide();
    $("#primeSectionData").show();
    $("#SecondDataSection").hide();



});
$(document).on('click', '#SentRecordList', function () {
    $("#Prime").hide();
    $("#Second").show();
    $("#primeSectionData").hide();
    $("#SecondDataSection").show();



});