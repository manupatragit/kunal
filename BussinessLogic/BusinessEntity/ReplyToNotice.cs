using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LawPracticeFirm.BusinessEntity
{
    public class ReplyToNotice
    {
        public string rootNoticeId { get; set; }
        public string PostedFiledocmodule { get; set; }
        public string parentId { get; set; }
        public string postedFiledata { get; set; }
        public string NoticeID { get; set; }
        public string UserId { get; set; }
        public string FirmId { get; set; }
        public string CurrentStatus { get; set; }
        public string CaseStatus { get; set; }
        public string NoticeType { get; set; }
        public string StatutoryProvision { get; set; }
        public string NoticeReceivedbyClient { get; set; }
        public string NoticeBroughtbyClientforReply { get; set; }
        public DateTime? ReplytoNoticeCreatedOn { get; set; }
        public DateTime? DateofReply { get; set; }
        public string ModeofServiceorDelivery { get; set; }
        public DateTime? GenerationofAlerts { get; set; }
        public string AssignmentofTask { get; set; }
        public string ReplyAddressedto { get; set; }
        public string AddresseeAddress { get; set; }
        public string OtherDetailsofAddressee { get; set; }
        public string RespondentsName { get; set; }
        public string RespondentsAddress { get; set; }
        public string DateofRejoinder { get; set; }
        public string NoticeTitle { get; set; }
        public string OtherDetailsofRespondent { get; set; }
        public string NoticeReference { get; set; }
        public string ReplySubject { get; set; }
        public string CreateReply { get; set; }
        public string ReplyThrough { get; set; }
        public DateTime? DateofDelivery { get; set; }
        public DateTime? DateofReceipt { get; set; }
        public string ClientName { get; set; }
        public string ManagerName { get; set; }
        public bool isClient { get; set; }
        public string TotalRows { get; set; }
        public bool IsFileAvailable { get; set; }
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
        public string formtype { get; set; }
        public string Criticality { get; set; }
        public string Amountclaimed { get; set; }
        public string RoOf { get; set; }
        public string Tag { get; set; }
        public DateTime? DueDateOfNotice { get; set; }
        public string Senderothertxt { get; set; }
        public string SenderName { get; set; }
        public string SenderNameId { get; set; }
        public string ResonForHighPriority { get; set; }
        public string SenderAddress { get; set; }
        public string OtherDetailsofsender { get; set; }
        
    }
}
