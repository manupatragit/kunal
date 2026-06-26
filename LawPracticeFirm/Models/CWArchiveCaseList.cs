using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// casewatch archive case list
    /// </summary>
    public class CWArchiveCaseList
    {
        public string CaseId { get; set; }
        public string UserCaseId { get; set; }
        public string CaseDairy { get; set; }
        public string Court { get; set; }
        public string State { get; set; }
        public string CaseName { get; set; }
        public string Advocate { get; set; }
        public string NextHearing { get; set; }
        public string DisposedDate { get; set; }
        public string Status { get; set; }
        public string CourtComplexCourtEstablishmentType { get; set; }
        public string CourtComplexCourtEstablishment { get; set; }
        public string RowId { get; set; }
        public string TotalRecord { get; set; }

    }
}