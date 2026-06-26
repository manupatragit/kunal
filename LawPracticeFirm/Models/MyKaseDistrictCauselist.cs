using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Mykase district cause list
    /// </summary>
    public class MyKaseDistrictCauselist
    {
        public string Case { get; set; }
        public string State { get; set; }
        public string District { get; set; }
        public string JudgeName { get; set; }
        public string SessionTime { get; set; }
        public string CourtComplexCourtEstablishmentType { get; set; }
        public string CourtComplexCourtEstablishment { get; set; }
        public string CauselistDate { get; set; }

        public string CauselistDetail { get; set; }
        public string CourtNo { get; set; }
        public string PartyName { get; set; }
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
    /// Export mykase district cause list
    /// </summary>
    public class ExportMyKaseDistrictCauselist
    {
        public string Case { get; set; }
        public string State { get; set; }
        public string District { get; set; }
        public string JudgeName { get; set; }
        public string courtestablishment { get; set; }
        public string CauselistDate { get; set; }
        public string CauselistDetail { get; set; }
        public string CourtNo { get; set; }
       // public string PartyName { get; set; }
        public string Stage { get; set; }
        public string ItemNo { get; set; }

    }
    /// <summary>
    /// Export mykase Revenue lst
    /// </summary>
    public class ExportMyKaseRevenueCauselist
    {
        public string Case { get; set; }
        public string CourtName { get; set; }
        public string Court { get; set; }
        public string AppealNo { get; set; }
        public string CauselistDate { get; set; }
        public string Stage { get; set; }
        public string ItemNo { get; set; }

    }
}