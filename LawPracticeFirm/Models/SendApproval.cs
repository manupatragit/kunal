using System;
namespace NoticeManagement.Models
{
    /// <summary>
    /// Send approval model
    /// </summary>
    public class SendApproval
    {
        public string NoticeID { get; set; }
        public string SenderID { get; set; }
        public string FirmId { get; set; }
        public string ReceiverID { get; set; }
        public DateTime dSendDate { get; set; }
        public int iApproverType { get; set; }
        public string iApprovalStatus { get; set; }
        public DateTime dApprovalDate { get; set; }
    }
}