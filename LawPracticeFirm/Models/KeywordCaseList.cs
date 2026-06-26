using System;

namespace LawPracticeFirm.Models.Keyword
{
    /// <summary>
    /// Keyword Case List
    /// </summary>
    public class KeywordCaseList
    {
        public int TotalRecord { get; set; }
        public int RowId { get; set; }
        public int iid { get; set; }
        public string uUserguid { get; set; }
        public string vKeyword { get; set; }
        public string itype { get; set; }
        public string appealno { get; set; }
        public string vCourt { get; set; }
        public string vDistrict { get; set; }
        public string Filetext { get; set; }
        public string vCauselistdate { get; set; }
        public string vJudge { get; set; }
        public string vCourtName { get; set; }
        public string Statename { get; set; }
        public string vDistrictName { get; set; }
        public string totalSentMail { get; set; }
        public string isAdded { get; set; }
        public string vCompEstbCodeName { get; set; }
        public string vDocType { get; set; }
        public string vstamp { get; set; }
        public string vCNRNo { get; set; }
        public string filingdate { get; set; }
        public string AlertReceivedOn { get; set; }

    }
}