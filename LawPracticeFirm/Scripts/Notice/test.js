if () {

}
else {
    if (notistatus == "Home") {
        $.each(response, function (i, a) {
            var amountclaimed = a.AmountClaimed == "0" || a.AmountClaimed == null ? "" : a.AmountClaimed;
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
                $("#noticetbldashboardfooter").append(tfot);
            }
            var span = document.createElement('span');
            span.innerHTML = a.CreateNotice;
            html += "<tr class=" + a.NoticeID + ">";
            html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
            html += "<td class='noticeby'>" + a.SendersName + ' ' + "<i class='fa fa-arrow-right' style='cursor:pointer' title='More...' onclick=fnfilterdata('SendersName','" + encodeURIComponent(a.SendersName) + "')></i>" + "</td>";

            html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
            html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
            html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
            html += "<td  class='criticality'>" + a.Criticality + "</td>";
            html += "<td  class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
            html += "<td  class='statutory'>" + a.NoticeType + "</td>";
            html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
            html += "<td class='pending'>" + a.CaseStatus + "</td>";
            html += "<td  class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
            html += "<td  class='servedon'>" + (a.DateofReceipt == null || a.DateofReceipt == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>"
            if (a.CreateNotice.length > 60) {
                html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
            }
            else {
                html += "<td  class='remark'>" + span.innerText + "</td>";
            }
            html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
            html += "<td class='actualclosedate'>" + (a.ActualDateOfClosure == null || a.ActualDateOfClosure == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ActualDateOfClosure))) + "</td>";

            if (a.iApprovalStatus != null) {
                var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                html += "<td class='managerapprove'><b style='padding-left:45px;color:#337ab7'>" + status + "</b><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
            }
            else {
                html += "<td class='managerapprove'></td>";
            }
            html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
            html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null || a.GenerationofAlerts == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
            html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
            html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
            html += "<td  class='addressto'>" + a.AddressedTo + "</td>";
            html += "<td  class='sendersname'>" + a.SendersName + "</td>";
            html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
            html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
            html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
            html += "<td class='assignmentoftast'>" + (a.AssignmentofTask == undefined ? '' : a.AssignmentofTask) + "</td>";
            html += "<td  class='currentstatus'>" + (a.ApprovedForDispatch == undefined ? '' : a.ApprovedForDispatch) + "</td>"
            html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null || a.NoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
            if (a.IsFileAvailable) {
                html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>';
            }
            else {
                html += '<td class="attachment"></td>';
            }
            html += "<td  class='tags'>" + a.Tag + "</td>";
            html += `<td><table cellpadding="0" cellspacing="0">
                                 <tbody>
                                 <tr>
                                 <td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditNotice("` + a.NoticeID + `") title="Edit Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=ConfirmDelete("` + a.NoticeID + `") title="Delete Notice"></a> | <a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("` + a.NoticeID + `") title="Send For Approval"></a></td>
                                 </tr>
                                 <tr>
                                <td><a class="fa fa-plus" style="cursor:pointer;" onclick=AddInComingReply("` + a.NoticeID + `") title = "Received Reply To Notice" ></a> | <a class="glyphicon glyphicon-share" style="cursor:pointer;" onclick=MoveToArchive("` + a.NoticeID + `") title = "Move to archive" ></a> | <a class="fa fa-calendar" style="cursor:pointer;" onclick=ClouserNotice("` + a.NoticeID + `") title = "Fill Closure Date" ></a></tr>
                                <tr>
                               <td><a class="glyphicon glyphicon-folder-open" title="View notice draft" style="cursor:pointer;" onclick=ViewNoticeDraft("` + a.NoticeID + `")></a></td>
                               </tr>
                               </tbody></table></td>`
            html += "<tr>"
        });

        $("#tablevalue").append(html);
        $("input:checkbox:not(:checked)").each(function () {
            var column = "table ." + $(this).attr("name");
            $(column).hide();
        });

    }
    else if (notistatus == "Draft") {
        $.each(response, function (i, a) {
            if (a.ApproveByClient == false && a.ApproveByManager == false) {
                var amountclaimed = a.AmountClaimed == "0" ? "" : a.AmountClaimed;
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
                    $("#noticetbldashboardfooter").append(tfot);
                }
                var span = document.createElement('span');
                span.innerHTML = a.CreateNotice;
                html += "<tr class=" + a.NoticeID + ">";
                html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                //html += "<td class='noticeby'>" + a.SendersName + "</td>";
                html += "<td class='noticeby'>" + a.SendersName + ' ' + "<i class='fa fa-arrow-right' style='cursor:pointer' title='More...' onclick=fnfilterdata('SendersName','" + encodeURIComponent(a.SendersName) + "')></i>" + "</td>";
                // html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                html += "<td class='noticeto'>" + a.AddressedTo + "</td>";
                html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                html += "<td  class='criticality'>" + a.Criticality + "</td>";
                html += "<td  class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                html += "<td class='pending'>" + a.CaseStatus + "</td>";
                html += "<td  class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                html += "<td  class='servedon'>" + (a.DateofReceipt == null || a.DateofReceipt == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>"
                if (a.CreateNotice.length > 60) {

                    html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
                }
                else {
                    html += "<td  class='remark'>" + span.innerText + "</td>";
                }
                html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
                html += "<td class='actualclosedate'>" + (a.ActualDateOfClosure == null || a.ActualDateOfClosure == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ActualDateOfClosure))) + "</td>";

                //if (a.ApproveByManager)
                if (a.iApprovalStatus != null) {
                    var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                    //  html += "<td class='managerapprove'><i style='padding-left:45px;color:green;font-size:15px;' class='fa fa-check' aria-hidden='true' title='Sent'></i><br/><span class='fa fa-eye' style='padding-left:45px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
                    html += "<td class='managerapprove'><b style='padding-left:45px;color:#337ab7'>" + status + "</b><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
                }
                else {
                    html += "<td class='managerapprove'></td>";
                    // html += "<td class='managerapprove'><i style='padding-left:45px;color:red;font-size:15px;' class='fa fa-times' aria-hidden='true' title='Not Sent'></i></td>";
                }
                //if (a.ApproveByClient) {
                //    html += "<td class='managerapprove'><i style='padding-left:45px;color:green;font-size:15px;' class='fa fa-check' aria-hidden='true' title='Sent'></i><br/><span class='fa fa-eye' style='padding-left:45px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Client') title='View more'></span></td>";
                //} else {
                //    html += "<td class='clientapprove'><i style='padding-left:45px;color:red;font-size:15px;' class='fa fa-times' aria-hidden='true' title='Not Sent'></i></td>";
                //}

                html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null || a.GenerationofAlerts == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                html += "<td  class='addressto'>" + a.AddressedTo + "</td>";
                html += "<td  class='sendersname'>" + a.SendersName + "</td>";
                html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
                html += "<td class='assignmentoftast'>" + (a.AssignmentofTask == undefined ? '' : a.AssignmentofTask) + "</td>";
                html += "<td  class='currentstatus'>" + (a.ApprovedForDispatch == undefined ? '' : a.ApprovedForDispatch) + "</td>"
                html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null || a.NoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                if (a.IsFileAvailable) {
                    html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                }
                else {
                    html += '<td class="attachment"></td>';
                }
                html += "<td  class='tags'>" + a.Tag + "</td>";
                // html += "<td class='attachment'><div style='width: max-content;padding-left: 15px;'>" + (a.IsFileAvailable == true ? "<a style='margin-right:5px;' href ='/NoticeNew/GetFiles?NoticeID=" + a.NoticeID + "' class='btn btn-success'> <i class='fa fa-paperclip' aria-hidden='true'></i></a>" : '') + "</div></td>";
                // html += '<td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditNotice("' + a.NoticeID + '") title="Edit Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title = "Delete Notice" ></a> | <a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("' + a.NoticeID + '") title = "Send For Approval" ></a> | <a class="fa fa-plus" style="cursor:pointer;" onclick=AddInComingReply("' + a.NoticeID + '") title = "Received Reply To Notice" ></a> | <a class="glyphicon glyphicon-share" style="cursor:pointer;" onclick=MoveToArchive("' + a.NoticeID + '") title = "Move to archive" ></a></td>';

                html += `<td><table cellpadding="0" cellspacing="0">
                                 <tbody>
                                 <tr>
                                 <td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditNotice("` + a.NoticeID + `") title="Edit Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=ConfirmDelete("` + a.NoticeID + `") title="Delete Notice"></a> | <a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("` + a.NoticeID + `") title="Send For Approval"></a></td>
                                 </tr>
                                 <tr>
                                <td><a class="fa fa-plus" style="cursor:pointer;" onclick=AddInComingReply("` + a.NoticeID + `") title = "Received Reply To Notice" ></a> | <a class="glyphicon glyphicon-share" style="cursor:pointer;" onclick=MoveToArchive("` + a.NoticeID + `") title = "Move to archive" ></a></tr>
                                <tr>
                               <td><a class="glyphicon glyphicon-folder-open" title="View notice draft" style="cursor:pointer;" onclick=ViewNoticeDraft("` + a.NoticeID + `")></a></td>
                               </tr>
                                </tbody></table></td>`

                html += "<tr>";
            }
        });

        $("#tablevalue").append(html);
        $("input:checkbox:not(:checked)").each(function () {
            var column = "table ." + $(this).attr("name");
            $(column).hide();
        });

    }
    else if (notistatus == "Sent") {
        $.each(response, function (i, a) {
            if (a.ApproveByClient == true || a.ApproveByManager == true) {
                var amountclaimed = a.AmountClaimed == "0" ? "" : a.AmountClaimed;
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
                    $("#noticetbldashboardfooter").append(tfot);
                }
                var span = document.createElement('span');
                span.innerHTML = a.CreateNotice;
                html += "<tr class=" + a.NoticeID + ">";
                html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                // html += "<td class='noticeby'>" + a.SendersName + "</td>";
                html += "<td class='noticeby'>" + a.SendersName + ' ' + "<i class='fa fa-arrow-right' style='cursor:pointer' title='More...' onclick=fnfilterdata('SendersName','" + encodeURIComponent(a.SendersName) + "')></i>" + "</td>";
                html += "<td class='noticeto'>" + a.AddressedTo + "</td>";
                //html += "<td class='noticeto'>" + a.AddressedTo + ' ' + "<i class='fa fa-arrow-right' style='cursor:pointer' title='More...' onclick=fnfilterdata('AddressedTo','" + encodeURIComponent(a.AddressedTo) + "')></i>" + "</td>";
                html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                html += "<td  class='criticality'>" + a.Criticality + "</td>";
                html += "<td  class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                //html += "<td  class='noticedate'>" + dateFormat(new Date(parseInt((a.DateofNotice).match(/\d+/)[0]))) + "</td>";
                html += "<td class='pending'>" + a.CaseStatus + "</td>";
                html += "<td  class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                html += "<td  class='servedon'>" + (a.DateofReceipt == null || a.DateofReceipt == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>"
                if (a.CreateNotice.length > 60) {

                    html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
                }
                else {
                    html += "<td  class='remark'>" + span.innerText + "</td>";
                }
                html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
                html += "<td class='actualclosedate'>" + (a.ActualDateOfClosure == null || a.ActualDateOfClosure == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ActualDateOfClosure))) + "</td>";
                //if (a.ApproveByManager)
                if (a.iApprovalStatus != null) {
                    var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                    //  html += "<td class='managerapprove'><i style='padding-left:45px;color:green;font-size:15px;' class='fa fa-check' aria-hidden='true' title='Sent'></i><br/><span class='fa fa-eye' style='padding-left:45px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
                    html += "<td class='managerapprove'><b style='padding-left:45px;color:#337ab7'>" + status + "</b><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
                }
                else {
                    html += "<td class='managerapprove'></td>";
                    // html += "<td class='managerapprove'><i style='padding-left:45px;color:red;font-size:15px;' class='fa fa-times' aria-hidden='true' title='Not Sent'></i></td>";
                }
                //if (a.ApproveByClient) {
                //    html += "<td class='managerapprove'><i style='padding-left:45px;color:green;font-size:15px;' class='fa fa-check' aria-hidden='true' title='Sent'></i><br/><span class='fa fa-eye' style='padding-left:45px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Client') title='View more'></span></td>";
                //} else {
                //    html += "<td class='clientapprove'><i style='padding-left:45px;color:red;font-size:15px;' class='fa fa-times' aria-hidden='true' title='Not Sent'></i></td>";
                //}

                html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null || a.GenerationofAlerts == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                html += "<td  class='addressto'>" + a.AddressedTo + "</td>";
                html += "<td  class='sendersname'>" + a.SendersName + "</td>";
                html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
                html += "<td class='assignmentoftast'>" + (a.AssignmentofTask == undefined ? '' : a.AssignmentofTask) + "</td>";
                html += "<td  class='currentstatus'>" + (a.ApprovedForDispatch == undefined ? '' : a.ApprovedForDispatch) + "</td>"
                html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null || a.NoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                if (a.IsFileAvailable) {
                    html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                }
                else {
                    html += '<td class="attachment"></td>';
                }
                html += "<td  class='tags'>" + a.Tag + "</td>";
                // html += "<td class='attachment'><div style='width: max-content;padding-left: 15px;'>" + (a.IsFileAvailable == true ? "<a style='margin-right:5px;' href ='/NoticeNew/GetFiles?NoticeID=" + a.NoticeID + "' class='btn btn-success'> <i class='fa fa-paperclip' aria-hidden='true'></i></a>" : '') + "</div></td>";
                //html += '<td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditNotice("' + a.NoticeID + '") title="Edit Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title = "Delete Notice" ></a> | <a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("' + a.NoticeID + '") title = "Send For Approval" ></a> | <a class="fa fa-plus" style="cursor:pointer;" onclick=AddInComingReply("' + a.NoticeID + '") title = "Received Reply To Notice" ></a> | <a class="glyphicon glyphicon-share" style="cursor:pointer;" onclick=MoveToArchive("' + a.NoticeID + '") title = "Move to archive" ></a></td>';

                html += `<td><table cellpadding="0" cellspacing="0">
                                 <tbody>
                                 <tr>
                                 <td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditNotice("` + a.NoticeID + `") title="Edit Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=ConfirmDelete("` + a.NoticeID + `") title="Delete Notice"></a> | <a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("` + a.NoticeID + `") title="Send For Approval"></a></td>
                                 </tr>
                                 <tr>
                                <td><a class="fa fa-plus" style="cursor:pointer;" onclick=AddInComingReply("` + a.NoticeID + `") title = "Received Reply To Notice" ></a> | <a class="glyphicon glyphicon-share" style="cursor:pointer;" onclick=MoveToArchive("` + a.NoticeID + `") title = "Move to archive" ></a></tr>
                                  <tr>
                               <td><a class="glyphicon glyphicon-folder-open" title="View notice draft" style="cursor:pointer;" onclick=ViewNoticeDraft("` + a.NoticeID + `")></a></td>
                               </tr>
                                </tbody></table></td>`

                html += "<tr>";
            }
        });

        $("#tablevalue").append(html);
        $("input:checkbox:not(:checked)").each(function () {
            var column = "table ." + $(this).attr("name");
            $(column).hide();
        });

    }
    else if (notistatus == "FinalApproved") {
        $.each(response, function (i, a) {
            // if (a.ApprovedForDispatch == "Approve") {
            if (a.iApprovalStatus == "Approve") {
                var amountclaimed = a.AmountClaimed == "0" ? "" : a.AmountClaimed;
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
                    $("#noticetbldashboardfooter").append(tfot);
                }
                var span = document.createElement('span');
                span.innerHTML = a.CreateNotice;
                html += "<tr class=" + a.NoticeID + ">";
                html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                //html += "<td class='noticeby'>" + a.SendersName + "</td>";
                html += "<td class='noticeby'>" + a.SendersName + ' ' + "<i class='fa fa-arrow-right' style='cursor:pointer' title='More...' onclick=fnfilterdata('SendersName','" + encodeURIComponent(a.SendersName) + "')></i>" + "</td>";
                html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                //html += "<td class='noticeto'>" + a.AddressedTo + ' ' + "<i class='fa fa-arrow-right' style='cursor:pointer' title='More...' onclick=fnfilterdata('AddressedTo','" + encodeURIComponent(a.AddressedTo) + "')></i>" + "</td>";
                html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                html += "<td  class='criticality'>" + a.Criticality + "</td>";
                html += "<td  class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                //html += "<td  class='noticedate'>" + dateFormat(new Date(parseInt((a.DateofNotice).match(/\d+/)[0]))) + "</td>";
                html += "<td class='pending'>" + a.CaseStatus + "</td>";
                html += "<td  class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                html += "<td  class='servedon'>" + (a.DateofReceipt == null || a.DateofReceipt == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>"
                if (a.CreateNotice.length > 60) {

                    html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
                }
                else {
                    html += "<td  class='remark'>" + span.innerText + "</td>";
                }
                html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
                html += "<td class='actualclosedate'>" + (a.ActualDateOfClosure == null || a.ActualDateOfClosure == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ActualDateOfClosure))) + "</td>";

                if (a.iApprovalStatus != null) {
                    var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                    html += "<td class='managerapprove'><b style='padding-left:45px;color:#337ab7'>" + status + "</b><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
                }
                else {
                    html += "<td class='managerapprove'></td>";
                }


                html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null || a.GenerationofAlerts == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                html += "<td  class='addressto'>" + a.AddressedTo + "</td>";
                html += "<td  class='sendersname'>" + a.SendersName + "</td>";
                html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
                html += "<td class='assignmentoftast'>" + (a.AssignmentofTask == undefined ? '' : a.AssignmentofTask) + "</td>";
                html += "<td  class='currentstatus'>" + (a.ApprovedForDispatch == undefined ? '' : a.ApprovedForDispatch) + "</td>"
                html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null || a.NoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                if (a.IsFileAvailable) {
                    html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                }
                else {
                    html += '<td class="attachment"></td>';
                }
                html += "<td  class='tags'>" + a.Tag + "</td>";
                html += `<td><table cellpadding="0" cellspacing="0">
                                 <tbody>
                                 <tr>
                                 <td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=FinalApproved("` + a.NoticeID + `") title="Save Final Status"></a> | <a class="glyphicon glyphicon-share" style="cursor:pointer;" onclick=MoveToArchive("` + a.NoticeID + `") title = "Move to archive" ></a> | <a class="fa fa-calendar" style="cursor:pointer;" onclick=ClouserNotice("` + a.NoticeID + `") title = "Fill Closure Date" ></a> </td>
                                 </tr>
                                 <tr>
                               <td><a class="glyphicon glyphicon-folder-open" title="View notice draft" style="cursor:pointer;" onclick=ViewNoticeDraft("` + a.NoticeID + `")></a></td>
                               </tr>
                                </tbody></table></td>`

                html += "<tr>";
            }
        });

        $("#tablevalue").append(html);
        $("input:checkbox:not(:checked)").each(function () {
            var column = "table ." + $(this).attr("name");
            $(column).hide();
        });

    }
    else if (notistatus == "Rejected") {
        $.each(response, function (i, a) {
            if (a.iApprovalStatus == "Reject") {
                var amountclaimed = a.AmountClaimed == "0" ? "" : a.AmountClaimed;
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
                    $("#noticetbldashboardfooter").append(tfot);
                }
                var span = document.createElement('span');
                span.innerHTML = a.CreateNotice;
                html += "<tr class=" + a.NoticeID + ">";
                html += '<td><span class="glyphicon glyphicon-chevron-down" title="View more item" style="cursor:pointer;" onclick=ViewMoreItem1("' + a.NoticeID + '")></span></td>';
                // html += "<td class='noticeby'>" + a.SendersName + "</td>";
                // html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                html += "<td class='noticeby'>" + a.SendersName + ' ' + "<i class='fa fa-arrow-right' style='cursor:pointer' title='More...' onclick=fnfilterdata('SendersName','" + encodeURIComponent(a.SendersName) + "')></i>" + "</td>";
                // html += "<td class='noticeto'>" + a.AddressedTo + ' ' + "<i class='fa fa-arrow-right' style='cursor:pointer' title='More...' onclick=fnfilterdata('AddressedTo','" + encodeURIComponent(a.AddressedTo) + "')></i>" + "</td>";
                html += "<td   class='noticeto'>" + a.AddressedTo + "</td>";
                html += "<td  class='noticesubject'>" + a.NoticeSubject + "</td>";
                html += "<td  class='noticetitle'>" + a.NoticeTitle + "</td>";
                html += "<td  class='criticality'>" + a.Criticality + "</td>";
                html += "<td  class='reasonforhighcriticality'>" + a.Resonforhighpriority + "</td>";
                html += "<td  class='statutory'>" + a.NoticeType + "</td>";
                html += "<td  class='noticedate'>" + dateFormat(new Date(a.DateofNotice)) + "</td>";
                //html += "<td  class='noticedate'>" + dateFormat(new Date(parseInt((a.DateofNotice).match(/\d+/)[0]))) + "</td>";
                html += "<td class='pending'>" + a.CaseStatus + "</td>";
                html += "<td  class='dispatched'>" + (a.DateofDelivery == null || a.DateofDelivery == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofDelivery))) + "</td>"
                html += "<td  class='servedon'>" + (a.DateofReceipt == null || a.DateofReceipt == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.DateofReceipt))) + "</td>"
                if (a.CreateNotice.length > 60) {

                    html += "<td  class='remark'>" + span.innerText.substring(0, 60) + '<a href="#" onclick=viewcontent("' + a.NoticeID + '","Notice") title="View more"> view more</a>' + "</td>";
                }
                else {
                    html += "<td  class='remark'>" + span.innerText + "</td>";
                }
                html += "<td class='amountclaimed'>" + amountclaimed + "</td>";
                html += "<td class='actualclosedate'>" + (a.ActualDateOfClosure == null || a.ActualDateOfClosure == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.ActualDateOfClosure))) + "</td>";
                if (a.iApprovalStatus != null) {
                    var status = a.iApprovalStatus == 'Approve' ? 'Approved' : a.iApprovalStatus == 'Reject' ? 'Rejected' : a.iApprovalStatus;
                    html += "<td class='managerapprove'><b style='padding-left:45px;color:#337ab7'>" + status + "</b><span class='fa fa-eye' style='padding-left:5px;cursor:pointer;color:#337ab7' onclick=fnviewlog('" + a.NoticeID + "','Manager') title='View more'></span></td>";
                }
                else {
                    html += "<td class='managerapprove'></td>";
                }

                html += "<td class='modeofserviceordelivery'>" + a.ModeofServiceorDelivery + "</td>";
                html += "<td   class='tatsetforassignee'>" + (a.GenerationofAlerts == null || a.GenerationofAlerts == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.GenerationofAlerts))) + "</td>";
                html += "<td  class='addressaddress'>" + a.AddresseeAddress + "</td>";
                html += "<td  class='otherdetailsofaddress'>" + a.OtherDetailsofAddressee + "</td>";
                html += "<td  class='addressto'>" + a.AddressedTo + "</td>";
                html += "<td  class='sendersname'>" + a.SendersName + "</td>";
                html += "<td class='senderaddress'>" + a.SendersAddress + "</td>";
                html += "<td  class='otherdetailsofaddressofsender'>" + a.OtherDetailsofSender + "</td>";
                html += "<td  class='noticethrough'>" + a.NoticeThrough + "</td>";
                html += "<td class='assignmentoftast'>" + (a.AssignmentofTask == undefined ? '' : a.AssignmentofTask) + "</td>";
                html += "<td  class='currentstatus'>" + (a.ApprovedForDispatch == undefined ? '' : a.ApprovedForDispatch) + "</td>"
                html += "<td  class='noticecreatedon'>" + (a.NoticeCreatedOn == null || a.NoticeCreatedOn == "1900-01-01T00:00:00" ? ' ' : dateFormat(new Date(a.NoticeCreatedOn))) + "</td>"
                if (a.IsFileAvailable) {
                    html += '<td class="attachment"><i class="fa fa-folder" aria-hidden="true"  id="noticerelevantdoc" style="cursor:pointer; text-align:center;color:#fd7e14;" id-val="' + a.NoticeID + '"></i></td>'
                }
                else {
                    html += '<td class="attachment"></td>';
                }
                html += "<td  class='tags'>" + a.Tag + "</td>";
                // html += '<td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=FinalApproved("' + a.NoticeID + '") title="Save Final Status"></a> </td>';
                html += '<td><a class="glyphicon glyphicon-pencil" style="cursor:pointer;"  onclick=EditNotice("' + a.NoticeID + '") title="Edit Notice"></a> | <a class="glyphicon glyphicon-trash" style="cursor:pointer;" onclick=ConfirmDelete("' + a.NoticeID + '") title = "Delete Notice" ></a> | <a class="fa fa-send" style="cursor:pointer;" onclick=SendApproval("' + a.NoticeID + '") title = "Send For Approval" ></a> | <a class="glyphicon glyphicon-share" style="cursor:pointer;" onclick=MoveToArchive("' + a.NoticeID + '") title = "Move to archive" ></a></td>';

                html += "<tr>";
            }
        });

        $("#tablevalue").append(html);
        $("input:checkbox:not(:checked)").each(function () {
            var column = "table ." + $(this).attr("name");
            $(column).hide();
        });

    }
}