using BussinessLogic.BusinessEntity;
using System;

namespace LawPracticeFirm.Models
{
    /// <summary>
    /// Casewatch list details
    /// </summary>
    public class CWCaseList
    {
        public string CaseId { get; set; }
        public string CaseDiary { get; set; }
        public string Court { get; set; }
        public string CaseName { get; set; }
        public string BenchName { get; set; }
        public string Advocate { get; set; }
        public string NextHearing { get; set; }
        public string DisposedDate { get; set; }
        public string Status { get; set; }
        public string District { get; set; }
        public string CourtComplexCourtEstablishmentType { get; set; }
        public string CourtComplexCourtEstablishment { get; set; }
        public string CourttypeId { get; set; }
        public string CourtId { get; set; }
        public string DistrictId { get; set; }
        public string TaggedName { get; set; }
        public string RowId { get; set; }
        public string TotalRecord { get; set; }
        public string UserCaseId { get; set; }
        public string MatterID { get; set; }
        public string MatterName { get; set; }
        public string MandalName { get; set; }
        public string JanpadName { get; set; }
        public string TahsilName { get; set; }
        public string RevenueCourtName { get; set; }
        public string vCaseNo { get; set; }
        public string vCaseYear { get; set; }
        public string ComputerCaseno { get; set; }
        public string Nature { get; set; }
        public string Act { get; set; }
        public string AdmissionDate { get; set; }
        public string cRefNo { get; set; }
        public string iCaseNotFound { get; set; }
        public string Reracourtname { get; set; }
        public string dEntryDate { get; set; }
        public string ManualNextHearing { get; set; }
        public string dUpdateDate { get; set; }
        public string vRefNo { get; set; }
        public string MasterCaseId { get; set; }
        public string Totals { get; set; }
        public string PetitionerName { get; set; }
        public string RespondentName { get; set; }
        public string CourtType { get; set; }
        public string vTaggedname { get; set; }
        public string CreatedOn { get; set; }
        public string CNRNo { get; set; }
        public string CourtName { get; set; }
        public string isDeleteLiveTrack { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }
        public string RegionName { get; set; }
        public string RegionCode { get; set; }
        public string CaseNote { get; set; }
        public string vJudCourt { get; set; }
        public string ManualCaseNumber { get; set; }
    }
    /// <summary>
    /// Litigation case details
    /// </summary>
    public class LitigationCaseDetails
    {
        public string Filingno { get; set; }
        public string FilingDate { get; set; }
        public string RegistationNo { get; set; }
        public string RegistationDate { get; set; }
        public string Firsthearingdate { get; set; }
        public string CourtNumber { get; set; }
        public string LodgmentNo { get; set; }
    }
    /// <summary>
    /// Litigation add case search
    /// </summary>
    public class LitigationAddCaseSearch
    {
        public string Id { get; set; }
        public string AppealNo { get; set; }
        public string CaseType { get; set; }
        public string Caseno { get; set; }
        public string CaseYear { get; set; }
        public string Court { get; set; }
        public string CourtName { get; set; }
        public string DistrictName { get; set; }
        public string Appres { get; set; }
        public string Filename { get; set; }
        public string Createdon { get; set; }
        public string Counsels { get; set; }
        public string RefApptypeId { get; set; }
        public string Filetext { get; set; }
        public string nexthearingdate { get; set; }
        public string Bench { get; set; }
        public string vDocumentType { get; set; }
        public string sflag { get; set; }
        public string CourtNo { get; set; }
        public string District { get; set; }
        public string CompEstbType { get; set; }
        public string CompEastbCourtId { get; set; }
        public string CNRNo { get; set; }
        public string vStampReg { get; set; }
        public string sCourt { get; set; }
        public string Benchid { get; set; }
        public string vState { get; set; }
        public string courttype { get; set; }
        public string BenchName { get; set; }

    }
    /// <summary>
    /// Litigation case details
    /// </summary>
    public class LitigationUserCaseDetails
    {
        public int totRow { get; set; }
        public string LoginId { get; set; }
        public string UserName { get; set; }
        public string totalcount { get; set; }
    }

    public class CaseDetailsListByUserCaseId
    {
        public string Id { get; set; }
        public string mname { get; set; }
        public string UserCaseId { get; set; }
    }

    /// <summary>
    /// Litigation case details
    /// </summary>
    public class LitigationRERHCaseDetails
    {
        public string Id { get; set; }
        public string AppealNo { get; set; }
        public string vcourt { get; set; }
        public string Appres { get; set; }
        public string Counsels { get; set; }
        public string vCasuelistDate { get; set; }
        public string janpadval { get; set; }
        public string purpose { get; set; }
        public string tahsilval { get; set; }
        public string Casetypename { get; set; }
        public string CourtName { get; set; }
    }
}