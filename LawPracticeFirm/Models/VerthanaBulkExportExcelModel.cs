using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class VerthanaBulkExportExcelModel
    {
        public string LoanType { get; set; }
        public string LoanID { get; set; }
        public string ClientID { get; set; }
        public string SchoolStudentName { get; set; }
        public string Branch { get; set; }
        public string State { get; set; }
        public string BranchAddress { get; set; }
        public string ProductName { get; set; }
        public string LoanAmount { get; set; }
        public string DisbursementDate { get; set; }
        public string EMIAmount { get; set; }
        public string EMIDueDate { get; set; }
        public string CurrentDPD { get; set; }
        public string BorrowerDetailsSchoolName1 { get; set; }
        public string BorrowerDetailsSchooladdress11 { get; set; }
        public string BorrowerDetailsSchoolphonenumber1 { get; set; }
        public string BorrowerDetailsSchoolemailid1 { get; set; }
        public string TrustDetailsTrustname1 { get; set; }
        public string TrustDetailsTrustaddress1 { get; set; }
        public string TrustDetailsTrustphonenumber1 { get; set; }
        public string TrustDetailsTrustemailid1 { get; set; }
        public string CoApplicantName1 { get; set; }
        public string CoApplicant1Address { get; set; }
        public string CoApplicant1PhoneNumber { get; set; }
        public string CoApplicant1EmailID { get; set; }
        public string CoApplicantName2 { get; set; }
        public string CoApplicant2Address { get; set; }
        public string CoApplicant2PhoneNumber { get; set; }
        public string CoApplicant2EmailID { get; set; }
        public string DunningReferencenumber { get; set; }
        public string DunningletterNoticeDate { get; set; }
        public string BranchCollectionManagerName { get; set; }
        public string BranchCollectionManagerNo { get; set; }
        public string TypeofNotice { get; set; }
    }
}