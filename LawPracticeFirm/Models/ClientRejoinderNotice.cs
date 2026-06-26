using System;

namespace NoticeManagement.Models
{
    /// <summary>
    /// Client rejoinder notice
    /// </summary>
    public class ClientRejoinderNotice
    {
        public string NoticeID { get; set; }
        public string UserId { get; set; }
        public string FirmId { get; set; }
        public string NoticeandReplyReference { get; set; }
        public string NoticeType { get; set; }
        public DateTime? DateofCreatingRejoinder { get; set; }
        public DateTime? DateofReceivingReply { get; set; }
        public DateTime? GenerationofAlerts { get; set; }
        public string NoticeTitle { get; set; }
        public string CreateNotice { get; set; }
        public string iApprovalStatus { get; set; }
        public string TotalRows { get; set; }
    }
}