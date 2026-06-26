using System;

namespace LawPracticeFirm.Models.Keyword
{
    /// <summary>
    /// Keyword list details
    /// </summary>
    public class KeywordList
    {        
        public int TotalRecord { get; set; }
        public int RowId { get; set; }
        public int iid { get; set; }
        public string vUsername { get; set; }
        public string vKeyword { get; set; }
        public string ddate { get; set; }
        public string isActive { get; set; }
        public string vCourtType { get; set; }
        public string courtTypeName { get; set; }
        public string vCourtName { get; set; }
    }
}