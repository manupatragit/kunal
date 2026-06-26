using System;

namespace NoticeManagement.Models
{
    /// <summary>
    /// Client reply notice
    /// </summary>
    public class ClientReplyNotice
    {
        public string NoticeID { get; set; }
        public string UserId { get; set; }
        public string FirmId { get; set; }
        public string NoticeReceivedbyClient { get; set; }
        public string NoticeType { get; set; }
        public DateTime? DateofReplytoNotice { get; set; }
        public DateTime? GenerationofAlerts { get; set; }
        public string NoticeTitle { get; set; }
        public string CreateReply { get; set; }
        public string iApprovalStatus { get; set; }
        public string TotalRows { get; set; }
    }
}