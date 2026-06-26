using System;
namespace NoticeManagement.Models
{
    /// <summary>
    /// Client notice
    /// </summary>
    public class ClientNotice
    {
        public string NoticeID { get; set; }
        public string UserId { get; set; }
        public string FirmId { get; set; }
        public string AddressedTo { get; set; }
        public string NoticeType { get; set; }
        public DateTime? DateofNotice { get; set; }
        public DateTime? GenerationofAlerts { get; set; }
        public string NoticeTitle { get; set; }
        public string CreateNotice { get; set; }
        public string iApprovalStatus { get; set; }
        public string TotalRows { get; set; }
    }
}