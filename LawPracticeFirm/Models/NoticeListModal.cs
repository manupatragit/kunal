using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class NoticeListModal
    {
        public Nullable<int> IsReplyReceivedCount { get; set; }
        public Nullable<int> IsFileAvailable { get; set; }
        public Nullable<System.Guid> NoticeID { get; set; }
        public string CaseStatus { get; set; }
        public string NoticeType { get; set; }
        public Nullable<System.DateTime> NoticeCreatedOn { get; set; }
        public Nullable<System.DateTime> DateofNotice { get; set; }
        public string ModeofServiceorDelivery { get; set; }
        public string AddressedTo { get; set; }
        public string AddresseeAddress { get; set; }
        public string OtherDetailsofAddressee { get; set; }
        public string SendersName { get; set; }
        public string SendersAddress { get; set; }
        public string OtherDetailsofSender { get; set; }
        public string NoticeSubject { get; set; }
        public string NoticeTitle { get; set; }
        public string CreateNotice { get; set; }
        public string NoticeThrough { get; set; }
        public Nullable<System.DateTime> DateofDelivery { get; set; }
        public Nullable<System.DateTime> DateofReceipt { get; set; }
        public Nullable<bool> ApproveByManager { get; set; }
        public Nullable<bool> ApproveByClient { get; set; }
        public string UserId { get; set; }
        public string ApprovedForDispatch { get; set; }
        public Nullable<System.DateTime> NoticeCreateDate { get; set; }
        public string Criticality { get; set; }
        public Nullable<System.DateTime> ActualDateOfClosure { get; set; }
        public string AmountClaimed { get; set; }
        public string Resonforhighpriority { get; set; }
        public Nullable<System.DateTime> GenerationofAlerts { get; set; }
        public string Tag { get; set; }
        public Nullable<System.DateTime> NoticeSentToClientDate { get; set; }
        public string TrackingId { get; set; }
        public string ConsignmentNum { get; set; }
        public Nullable<System.DateTime> ConsignDate { get; set; }
        public string iApprovalStatus { get; set; }
        public string iApprovalStatusForUser { get; set; }
        public string iApprovalStatusForClient { get; set; }
        public Nullable<int> TotalRows { get; set; }
        public Nullable<int> SetteldCount { get; set; }
        public Nullable<int> ConvertedtoMatter { get; set; }
        public Nullable<int> RowId { get; set; }
        public string RoOf { get; set; }
        public string SonOf { get; set; }
        public string SenderNameId { get; set; }
        public string CreatedByName { get; set; }
        public string col1 { get; set; }
        public string col2 { get; set; }
        public string col3 { get; set; }
        public string col4 { get; set; }
        public string col5 { get; set; }
        public string col6 { get; set; }
        public string col7 { get; set; }
        public string col8 { get; set; }
        public string col9 { get; set; }
        public string col10 { get; set; }
        public string col11 { get; set; }
        public string col12 { get; set; }
        public string col13 { get; set; }
        public string col14 { get; set; }
        public string col15 { get; set; }
        public Nullable<System.DateTime> DueDateOfNotice { get; set; }
        public string Senderothertxt { get; set; }
        public Nullable<int> IsOtherDetailsOfReceiver { get; set; }
        public Nullable<int> IsLinkToMatter { get; set; }
        public Nullable<int> oedit { get; set; }
        public Nullable<int> odelete { get; set; }
        public Nullable<int> ocreate { get; set; }
        public string MatterId { get; set; }
        public string ClientName { get; set; }
        public string NoticeReference { get; set; }
        public string IntNoticeReference { get; set; }
        public Nullable<System.DateTime> Dateofdispatch { get; set; }
    }

    public class RecievedNoticModal
    {
        public Nullable<int> IsFileAvailable { get; set; }
        public Nullable<System.Guid> NoticeID { get; set; }
        public string CaseStatus { get; set; }
        public string NoticeType { get; set; }
        public Nullable<System.DateTime> DateofNotice { get; set; }
        public Nullable<System.DateTime> DateofDispatchofNotice { get; set; }
        public Nullable<System.DateTime> DateofServiceofNotice { get; set; }
        public Nullable<System.DateTime> DateofReplytoNotice { get; set; }
        public Nullable<System.DateTime> DateofReceivingReply { get; set; }
        public string ModeofReceipt { get; set; }
        public string Rejoinder { get; set; }
        public Nullable<System.DateTime> DateofCreatingRejoinder { get; set; }
        public Nullable<System.DateTime> DateofRejoinder { get; set; }
        public string ModeofDeliveryofRejoinder { get; set; }
        public string RejoinderAddressedto { get; set; }
        public string NoticeandReplyReference { get; set; }
        public string OtherDetailsofAddressee { get; set; }
        public string AddresseeAddress { get; set; }
        public string NoticeTitle { get; set; }
        public string RejoinderSubject { get; set; }
        public string CreateRejoinder { get; set; }
        public string RejoinderThrough { get; set; }
        public Nullable<System.DateTime> DateofDelivery { get; set; }
        public Nullable<System.DateTime> DateofReceipt { get; set; }
        public Nullable<bool> ApproveByClient { get; set; }
        public Nullable<bool> ApproveByManager { get; set; }
        public string ApprovedForDispatch { get; set; }
        public Nullable<System.DateTime> NoticeCreateDate { get; set; }
        public string UserId { get; set; }
        public string iApprovalStatus { get; set; }
        public Nullable<int> TotalRows { get; set; }
        public Nullable<int> SetteldCount { get; set; }
        public Nullable<int> ConvertedtoMatter { get; set; }
        public Nullable<int> RowId { get; set; }
        public Nullable<int> IsLinkToMatter { get; set; }
        public Nullable<int> oedit { get; set; }
        public Nullable<int> odelete { get; set; }
        public Nullable<int> ocreate { get; set; }
        public string MatterId { get; set; }
        public Nullable<System.DateTime> Modify_Date { get; set; }
        public string ClientName { get; set; }
        public string NoticeThroughId { get; set; }
        public string SendersName { get; set; }
        public string SendersAddress { get; set; }
        public string Senderothertxt { get; set; }
        public Nullable<System.DateTime> DueDateOfNotice { get; set; }
        public string OtherDetailsofSender { get; set; }
        public string AmountClaimed { get; set; }
        public string Tag { get; set; }
        public string Criticality { get; set; }
        public string Resonforhighpriority { get; set; }
        public string CreatedByName { get; set; }
        public string SonOf { get; set; }
        public string NoticeThrough { get; set; }
        public Nullable<int> IsReplyReceivedCount { get; set; }
        public string NoticeReference { get; set; }
        public string IntNoticeReference { get; set; }
        public string iApprovalStatusForUser { get; set; }
        public string iApprovalStatusForClient { get; set; }
        public string col1 { get; set; }
        public string col2 { get; set; }
        public string col3 { get; set; }
        public string col4 { get; set; }
        public string col5 { get; set; }
        public string col6 { get; set; }
        public string col7 { get; set; }
        public string col8 { get; set; }
        public string col9 { get; set; }
        public string col10 { get; set; }
        public string col11 { get; set; }
        public string col12 { get; set; }
        public string col13 { get; set; }
        public string col14 { get; set; }
        public string col15 { get; set; }
        public string ActualDateOfClosure { get; set; }
    }

}