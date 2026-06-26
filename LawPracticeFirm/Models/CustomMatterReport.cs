using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawPracticeFirm.Models
{
    public class CustomMatterReport
    {
        public string Id { get; set; }
        public string Court { get; set; }
        public string CourtName { get; set; }
        public string PetitionerName { get; set; }
        public string RespondentName { get; set; }
        public string VStatus { get; set; }
        public string Nexthearingdate { get; set; }
        public string MatterName { get; set; }
        public string CaseNo { get; set; }
        public string OtherCourtName { get; set; }
        public string CourtComplex { get; set; }
        public string CasenumberInternal { get; set; }
        public string ZoneName { get; set; }
        public string dFilingDate { get; set; }
        
    }
    public class CustomReportCourtComplex
    {
        public string Court { get; set; }
        public string CourtName { get; set; }
        public string CourtComplex { get; set; }
        public string OtherCourtName { get; set; }
        public string MatterName { get; set; }
        public string CaseNo { get; set; }
        public string dFilingDate { get; set; }
        public string VStatus { get; set; }
        public string Nexthearingdate { get; set; }
    }
    public class CustomReportCourtComplexRbiModal
    {
        public string Court { get; set; }
        public string CourtName { get; set; }
        public string CourtComplex { get; set; }
        public string OtherCourtName { get; set; }
        public string MatterName { get; set; }
        public string CaseNo { get; set; }
        public string dFilingDate { get; set; }
        public string contested { get; set; }
        public string location { get; set; }
        public string department { get; set; }
        public string Nexthearingdate { get; set; }
    }
    public class CustomReportCourtReportRbiModal
    {
        public string Id { get; set; }
        public string Court { get; set; }
        public string CourtName { get; set; }
        public string CourtComplex { get; set; }
        public string OtherCourtName { get; set; }
        public string MatterName { get; set; }
        public string CaseNo { get; set; }
        public string dFilingDate { get; set; }
        public string contested { get; set; }
        public string location { get; set; }
        public string department { get; set; }
        public string Nexthearingdate { get; set; }
        public string PetitionerName { get; set; }
        public string RespondentName { get; set; }
        public string CasenumberInternal { get; set; }
    }

}