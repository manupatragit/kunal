using System;
using System.Web;
using System.Web.Mvc;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Notice reply model
    /// </summary>
    public class ReplyToNoticeModal
    {
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
        public DateTime DateofReply { get; set; }
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
        [AllowHtml]
        public string CreateReply { get; set; }
        public string ReplyThrough { get; set; }
        public DateTime? DateofDelivery { get; set; }
        public DateTime DateofReceipt { get; set; }
        public HttpPostedFileBase[] Files { get; set; }
        public string ClientName { get; set; }
        public string ManagerName { get; set; }
        public bool isClient { get; set; }
        public string TotalRows { get; set; }
        public bool IsFileAvailable { get; set; }
    }
}