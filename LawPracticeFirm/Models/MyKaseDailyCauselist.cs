using System;
using System.Collections.Generic;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Mykase daily causelist
    /// </summary>
    public class MyKaseDailyCauselist
    {
        public string Courtname { get; set; }
        public string CaseType { get; set; }
        public string Caseno { get; set; }
        public string Caseyear { get; set; }
        public string Benchname { get; set; }
        public string CourtNo { get; set; }
        public string JudgeName { get; set; }
        public string SessionTime { get; set; }
        public string CauselistDate { get; set; }
        public string Filetext { get; set; }
        public string CauselistDetail { get; set; }
        public string Partyname { get; set; }
        public string CaseId { get; set; }
        public string RowId { get; set; }
        public string TotalRecord { get; set; }
        public string MasterCaseId { get; set; }
        public string UserCaseId { get; set; }
        public string Stage { get; set; }
        public string DiaryNo { get; set; }
        public string DiaryYear { get; set; }
        public string filename { get; set; }
        public string ItemNo { get; set; }

    }
    /// <summary>
    /// Export daily cause list
    /// </summary>
    public class ExportDailyCauseList
    {
        public string Courtname { get; set; }
        public string CaseType { get; set; }
        public string Caseno { get; set; }
        public string Caseyear { get; set; }
        public string Benchname { get; set; }
        public string CourtNo { get; set; }
        public string JudgeName { get; set; }
        public string CauselistDate { get; set; }
        public string CauselistDetail { get; set; }
        // public string Partyname { get; set; }
        public string Stage { get; set; }
        public string ItemNo { get; set; }

        //public string DiaryNo { get; set; }
        //public string DiaryYear { get; set; }

    }
    public class ExportDailyCauseListForCW
    {
        public string Courtname { get; set; }
        public string CaseType { get; set; }
        public string Caseno { get; set; }
        public string Caseyear { get; set; }
        public string CourtNo { get; set; }
        public string JudgeName { get; set; }
        public string CauselistDate { get; set; }
        public string CauselistDetail { get; set; }
        public string Stage { get; set; }
        public string DiaryNo { get; set; }
        public string DiaryYear { get; set; }
        public string ItemNo { get; set; }


    }
    public class ExportDailyCauseListForTribunal
    {
        public string Courtname { get; set; }
        public string CaseType { get; set; }
        public string Benchname { get; set; }
        public string Caseno { get; set; }
        public string Caseyear { get; set; }
        public string CourtNo { get; set; }
        public string JudgeName { get; set; }
        public string CauselistDate { get; set; }
        public string CauselistDetail { get; set; }
        public string Stage { get; set; }
        public string DiaryNo { get; set; }
        public string DiaryYear { get; set; }
        public string ItemNo { get; set; }

    }
    public class MyKaseDailyRevCauselist
    {
        public string vCaseName { get; set; }
        public string vCaseNo { get; set; }
        public string vCourt { get; set; }
        public string vCauselistDate { get; set; }
        public string AppealNo { get; set; }
        public string Courtname { get; set; }
        public string vItemNo { get; set; }
        public string vpartyname { get; set; }
        public string vStatus { get; set; }
        public string MasterCaseId { get; set; }
        public string UserCaseId { get; set; }
        public string filename { get; set; }
        public string TotalRecord { get; set; }
    }

}