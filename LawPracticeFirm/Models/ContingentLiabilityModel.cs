using System;
using System.Collections.Generic;
namespace NJDGDetail.Models
{
    /// <summary>
    /// Add case object
    /// </summary>
    public class ContingentLiabilityModel
    {
        public string MatterId { get; set; }

        public string CaseId { get; set; }

        public string Zone { get; set; }

        public string Branch { get; set; }

        // Account Holder / Borrower
        public string AccountHolderName { get; set; }

        // Claimant Details
        public string ClaimantName { get; set; }

        public string ClaimantAddress { get; set; }

        // Claim / Suit Details
        public DateTime? DateOfClaim { get; set; }

        public string CaseNo { get; set; }

        // Claim Amount Breakup
        public decimal? BankGuarantee { get; set; }

        public decimal? LetterOfCredit { get; set; }

        public decimal? WrongPayment { get; set; }

        public decimal? Fraud { get; set; }

        public decimal? CounterClaim { get; set; }

        public decimal? OthersClaim { get; set; }

        // Security Details
        public string NatureOfSecurity { get; set; }

        public decimal? RealisableValue { get; set; }

        // Case Facts
        public string FactsOfCase { get; set; }

        // Hearing
        public string NextHearingPurpose { get; set; }

        public DateTime? NextHearingDate { get; set; }

        // Provision Details
        public string ProvisionDetail { get; set; }

        public string YearOfProvision { get; set; }

        public decimal? AmountProvision { get; set; }

        public decimal? AmountDepositedInCourt { get; set; }
    }
}