using System;
using System.Collections.Generic;
namespace NJDGDetail.Models
{
    /// <summary>
    /// Add case object
    /// </summary>
    public class AgainstBankModel
    {
        public string MatterId { get; set; }

        public string CaseNo { get; set; }
        public string CaseId { get; set; }
        public string Zone { get; set; }
        public string Branch { get; set; }

        public string AccountHolderName { get; set; }
        public string ClaimantAddress { get; set; }

        public string CIFNo { get; set; }
        public string AccountNo { get; set; }

        public DateTime? FirstSummonDate { get; set; }
        public DateTime? FirstSummonReceivedDate { get; set; }

        public string RespondentDetails { get; set; }
        public string ProformaParties { get; set; }

        public string CaseProposing { get; set; }
        public string CaseType { get; set; }
        public string Department { get; set; }

        public string CourtDetail { get; set; }
        public string PlaceOfCourt { get; set; }

        public string AreaOfComplaint { get; set; }

        public DateTime? WrittenStatementDate { get; set; }
        public string FactsOfCase { get; set; }

        public decimal? ClaimAmount { get; set; }

        public string AdvocateName { get; set; }
        public string AdvocateContact { get; set; }

        public string PresentStatus { get; set; }

        public DateTime? NextHearingDate { get; set; }
        public string NextHearingPurpose { get; set; }

        public DateTime? InterimOrderDate { get; set; }
        public DateTime? InterimOrderReceivedDate { get; set; }

        public string InterimDirection { get; set; }
        public string InterimComplianceStatus { get; set; }
        public string InterimRemarks { get; set; }

        public DateTime? DisposalDate { get; set; }
        public DateTime? FinalOrderReceivedDate { get; set; }

        public decimal? AwardAmount { get; set; }

        public string FinalDirection { get; set; }
        public string FinalComplianceStatus { get; set; }
        public string FinalRemarks { get; set; }
    }

}