using System;
using System.Web;
using System.Web.Mvc;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Rejoinder notice model
    /// </summary>
    public class RejoinderNoticeModal
    {
        public string NoticeID { get; set; }
        public string UserId { get; set; }
        public string FirmId { get; set; }
        public string CaseStatus { get; set; }
        public string NoticeType { get; set; }
        public string CurrentStatus { get; set; }
        public string AssignmentofTask { get; set; }
        public DateTime? GenerationofAlerts { get; set; }
        public DateTime? DateofNotice { get; set; }
        public DateTime? DateofDispatchofNotice { get; set; }
        public DateTime? DateofServiceofNotice { get; set; }
        public DateTime? DateofReplytoNotice { get; set; }
        public DateTime DateofReceivingReply { get; set; }
        public string ModeofReceipt { get; set; }
        public string Rejoinder { get; set; }
        public DateTime? DateofCreatingRejoinder { get; set; }
        public DateTime DateofRejoinder { get; set; }
        public string ModeofDeliveryofRejoinder { get; set; }
        public string NoticeTitle { get; set; }
        public string RejoinderAddressedto { get; set; }
        public string AddresseeAddress { get; set; }
        public string OtherDetailsofAddressee { get; set; }
        public string NoticeandReplyReference { get; set; }
        public string RejoinderSubject { get; set; }
        [AllowHtml]
        public string CreateRejoinder { get; set; }
        public string RejoinderThrough { get; set; }
        public DateTime? DateofDelivery { get; set; }
        public DateTime DateofReceipt { get; set; }
        public string TotalRows { get; set; }
        public HttpPostedFileBase[] Files { get; set; }
        public string ClientName { get; set; }
        public string ManagerName { get; set; }
        public bool isClient { get; set; }
        public bool IsFileAvailable { get; set; }
    }
}