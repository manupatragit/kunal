using System;

namespace LawPracticeFirm.Models.Keyword
{
    /// <summary>
    /// Keywords quota list
    /// </summary>
    public class KeywordsQuotaList
    {
        public string vQuota { get; set; }
        public string addedkeyword { get; set; }
        public string iApproved { get; set; }
        public string ApprovedBy { get; set; }
        public string ApprovedOn { get; set; }
        public string Remarks { get; set; }
        public string vUserName { get; set; }
        public string ddate { get; set; }
        public string dExpiryDate { get; set; }
        public string KeywordPlanId { get; set; }
    }
}