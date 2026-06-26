using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Alert list object
    /// </summary>
    public class AlertlistObject
    {
        public string RowId { get; set; }
        public string SMSText { get; set; }
        public string EmailText { get; set; }
        public string SentOn { get; set; }
        public string TotalRecord { get; set; }
    }
}