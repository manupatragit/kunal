using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Mykase revenue cause list
    /// </summary>
    public class MyKaseRevenueCauselist
    {
        public int RowId { get; set; }
        public int refrowid { get; set; }
        public string iid { get; set; }
        public string RevenueCourtName { get; set; }
        public string JanpadName { get; set; }
        public string MandalName { get; set; }
        public string TahsilName { get; set; }
        public string vCourtName { get; set; }
        public string vCaseName { get; set; }
        public string vCaseType { get; set; }
        public string vCaseNo { get; set; }
        public string vCaseYear { get; set; }
        public string vCourt { get; set; }
        public string vDistrictId { get; set; }
        public string JudgName { get; set; }
        public string SessionTime { get; set; }
        public string vcasetypename { get; set; }
        public string vCauselistDate { get; set; }
        public string Filetext { get; set; }
        public string vItemno { get; set; }
        public string vDocumentType { get; set; }
        public string vCourtNo { get; set; }
        public string filename { get; set; }
        public string vpartyname { get; set; }
        public string vCourtDetails { get; set; }
        public string Notes { get; set; }
        public string caseid { get; set; }
        public string vStatus { get; set; }
        public string vNature { get; set; }
        public string vComputerCaseno { get; set; }
        public string vFilingDate { get; set; }
        public string vActDec { get; set; }
        public string vArgumentNature { get; set; }
        public string Tablename { get; set; }
        public string TotalRecord { get; set; }
        public string usercaseid { get; set; }
        public string CaseName { get; set; }
        public string CaseNo { get; set; }
        public string CauseListDate { get; set; }
        public string CauseListDetail { get; set; }
    }

    /// <summary>
    /// Export mykase revenue cause list
    /// </summary>
    public class MyKaseRevenueCauselistExport
    {
        public string RevenueCourtName { get; set; }
        public string JanpadName { get; set; }
        public string MandalName { get; set; }
        public string TahsilName { get; set; }
        public string CaseName { get; set; }
        public string CaseNo { get; set; }
        public string CauseListDate { get; set; }
        public string CauseListDetail { get; set; }
    }
}